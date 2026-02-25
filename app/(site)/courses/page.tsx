import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoCourses = [
  {
    id: "real-analysis-1",
    title: "Real Analysis I",
    description: "Limits, continuity, sequences/series, and proof techniques.",
  },
];

export default function CoursesPage() {
  return (
    <div className="container py-14">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Course-aligned assistants using your definitions, theorems, and style.
          </p>
        </div>
        <Badge>Starting with Real Analysis I</Badge>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`} className="no-underline">
            <Card className="h-full p-6 transition-shadow hover:shadow-md">
              <div className="text-lg font-medium">{course.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
              <div className="mt-4 text-sm text-primary">View course →</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
