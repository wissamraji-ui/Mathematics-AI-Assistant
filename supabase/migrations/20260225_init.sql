-- Core extensions
create extension if not exists pgcrypto;
create extension if not exists vector;

-- Courses
create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Users (profile table synced from auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- Keep public.users in sync on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''), 'student')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Subscriptions (one row per user)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null check (plan in ('student', 'pro')),
  status text not null,
  current_period_end timestamptz
);

-- Documents uploaded to storage
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  course_id text not null references public.courses (id) on delete restrict,
  uploaded_by uuid not null references public.users (id) on delete restrict,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- Chunks for RAG retrieval
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index integer not null,
  content_text text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index if not exists documents_course_id_idx on public.documents (course_id);
create index if not exists chunks_document_id_idx on public.chunks (document_id);
create index if not exists chunks_embedding_hnsw_idx on public.chunks using hnsw (embedding vector_cosine_ops);

-- Vector search function used by /api/chat and /api/retrieve
create or replace function public.match_chunks(
  query_embedding vector(1536),
  match_count integer,
  course_id text
)
returns table (
  id uuid,
  document_id uuid,
  document_title text,
  content_text text,
  metadata jsonb,
  similarity double precision
)
language sql
stable
as $$
  select
    c.id,
    c.document_id,
    d.title as document_title,
    c.content_text,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  join public.documents d on d.id = c.document_id
  where d.course_id = match_chunks.course_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- Seed a first course
insert into public.courses (id, title, description, is_active)
values ('real-analysis-1', 'Real Analysis I', 'Limits, continuity, sequences/series, and proof techniques.', true)
on conflict (id) do nothing;

-- RLS
alter table public.courses enable row level security;
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.documents enable row level security;
alter table public.chunks enable row level security;

-- Helper: admin check
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
  );
$$;

-- courses policies
drop policy if exists "Public can read active courses" on public.courses;
create policy "Public can read active courses"
  on public.courses for select
  using (is_active = true);

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses"
  on public.courses for all
  using (public.is_admin())
  with check (public.is_admin());

-- users policies
drop policy if exists "Users read own profile" on public.users;
create policy "Users read own profile"
  on public.users for select
  using (id = auth.uid());

drop policy if exists "Users update own profile" on public.users;
create policy "Users update own profile"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Admins read all users" on public.users;
create policy "Admins read all users"
  on public.users for select
  using (public.is_admin());

drop policy if exists "Admins update all users" on public.users;
create policy "Admins update all users"
  on public.users for update
  using (public.is_admin())
  with check (public.is_admin());

-- subscriptions policies (users can read their own)
drop policy if exists "Users read own subscription" on public.subscriptions;
create policy "Users read own subscription"
  on public.subscriptions for select
  using (user_id = auth.uid());

-- documents/chunks policies (admin only)
drop policy if exists "Admins manage documents" on public.documents;
create policy "Admins manage documents"
  on public.documents for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage chunks" on public.chunks;
create policy "Admins manage chunks"
  on public.chunks for all
  using (public.is_admin())
  with check (public.is_admin());

-- Storage bucket for documents (optional; requires Supabase storage enabled)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies (admin only)
drop policy if exists "Admins upload documents" on storage.objects;
create policy "Admins upload documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.is_admin());

drop policy if exists "Admins read documents" on storage.objects;
create policy "Admins read documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.is_admin());

