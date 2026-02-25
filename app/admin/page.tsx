import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage courses, documents, users, and ingestion.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="font-medium">Courses</div>
          <p className="mt-2 text-sm text-muted-foreground">Create and activate courses.</p>
          <Button className="mt-5" asChild>
            <Link href="/admin/courses">Manage</Link>
          </Button>
        </Card>
        <Card className="p-6">
          <div className="font-medium">Documents</div>
          <p className="mt-2 text-sm text-muted-foreground">Upload notes and ingest into the vector index.</p>
          <Button className="mt-5" asChild>
            <Link href="/admin/documents">Upload</Link>
          </Button>
        </Card>
        <Card className="p-6">
          <div className="font-medium">Users</div>
          <p className="mt-2 text-sm text-muted-foreground">View users and roles.</p>
          <Button className="mt-5" asChild variant="secondary">
            <Link href="/admin/users">View</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

