import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AppDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user ? `Signed in as ${user.email}` : "Signed in."} Choose a mode to begin.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="font-medium">Chat tutor</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Hint ladder tutoring with rigor control and citations to your notes.
          </p>
          <Button className="mt-5" asChild>
            <Link href="/app/chat">Open chat</Link>
          </Button>
        </Card>
        <Card className="p-6">
          <div className="font-medium">Practice mode</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate exercises by topic/difficulty and get step-by-step guidance.
          </p>
          <Button className="mt-5" asChild variant="secondary">
            <Link href="/app/practice">Open practice</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

