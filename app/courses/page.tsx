import Link from "next/link";
import { Card } from "@/components/ui/card";

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
      <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Course-aligned assistants using your definitions, theorems, and style.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`} className="no-underline">
            <Card className="h-full p-5 hover:border-primary/40">
              <div className="text-lg font-medium">{course.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

