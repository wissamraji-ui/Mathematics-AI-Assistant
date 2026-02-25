import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="no-underline">
          <div className="font-semibold tracking-tight">Mathematics AI Assistant</div>
          <div className="text-xs text-muted-foreground">Proof-first • Hint ladder • Course-aligned</div>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/courses" className="text-muted-foreground hover:text-foreground">
            Courses
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Button asChild size="sm" variant="secondary">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
