import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-8 py-10 sm:grid-cols-2">
        <div>
          <div className="font-semibold tracking-tight">Mathematics AI Assistant</div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A proof-oriented tutor with a hint ladder and course-aligned notes. Study aid only—no grade guarantees.
          </p>
          <div className="mt-5 text-xs text-muted-foreground">© {new Date().getFullYear()} Mathematics AI Assistant</div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:justify-self-end">
          <div className="space-y-2 text-sm">
            <div className="font-medium text-foreground">Product</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/courses">Courses</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/signup">Get started</Link>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium text-foreground">Legal</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
