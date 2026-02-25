import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Course: {params.courseId}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            This page will be backed by Supabase courses + your uploaded notes. For now it shows a demo course page.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/chat">Open tutor</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="font-medium">What you’ll get</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Hint ladder: small hint → bigger hint → outline</li>
            <li>Rigor selector and proof-first style</li>
            <li>Citations to your notes when relevant</li>
          </ul>
        </Card>
        <Card className="p-6">
          <div className="font-medium">Integrity</div>
          <p className="mt-3 text-sm text-muted-foreground">
            The assistant is designed to support learning and will avoid solution dumping, especially for graded work.
          </p>
        </Card>
      </div>
    </div>
  );
}

