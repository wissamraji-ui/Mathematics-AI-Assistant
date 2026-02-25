import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"), getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          (cookieStore as any).set({ name, value, ...options });
        } catch {
          // Server Components may not allow setting cookies. Ignore and rely on middleware/route handlers when needed.
        }
      },
      remove(name: string, options: any) {
        try {
          (cookieStore as any).set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // ignore (see set)
        }
      },
    },
  });
}

export function createSupabaseServiceClient() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}
