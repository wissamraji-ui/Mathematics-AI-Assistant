import Link from "next/link";
import { Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sigma className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2 font-semibold tracking-tight">
                Mathematics AI Assistant
                <Badge className="hidden sm:inline-flex">Beta</Badge>
              </div>
              <div className="text-xs text-muted-foreground">Proof-first • Hint ladder • Course-aligned</div>
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/courses"
            className="hidden rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            Courses
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            Pricing
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground md:inline-flex"
          >
            How it works
          </Link>
          <Button asChild size="sm" variant="ghost">
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
