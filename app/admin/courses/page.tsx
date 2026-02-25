import { Card } from "@/components/ui/card";

export default function AdminCoursesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin · Courses</h1>
      <p className="mt-2 text-sm text-muted-foreground">MVP placeholder. This will list/create courses from Supabase.</p>
      <Card className="mt-8 p-6">
        <div className="text-sm text-muted-foreground">TODO: Course management UI</div>
      </Card>
    </div>
  );
}

