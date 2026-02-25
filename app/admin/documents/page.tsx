"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDocumentsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin · Documents</h1>
      <p className="mt-2 text-sm text-muted-foreground">Upload and ingest notes into the vector index.</p>

      <Card className="mt-8 p-6">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setStatus(null);
            setLoading(true);
            try {
              const formData = new FormData(e.currentTarget);
              const res = await fetch("/api/upload", { method: "POST", body: formData });
              if (!res.ok) throw new Error(await res.text());
              setStatus("Uploaded and ingested.");
              e.currentTarget.reset();
            } catch (err) {
              setStatus(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Real Analysis Notes" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="courseId">Course ID</Label>
            <Input id="courseId" name="courseId" placeholder="real-analysis-1" defaultValue="real-analysis-1" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="file">File (pdf, md, txt)</Label>
            <Input id="file" name="file" type="file" required />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Uploading…" : "Upload + ingest"}
          </Button>

          {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
        </form>
      </Card>
    </div>
  );
}

