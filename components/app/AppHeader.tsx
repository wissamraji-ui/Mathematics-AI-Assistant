import Link from "next/link";
import { Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/app" className="no-underline">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sigma className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline">Mathematics AI Assistant</span>
            <span className="sm:hidden">Math AI</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/chat">Chat</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/practice">Practice</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/billing">Billing</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/profile">Profile</Link>
          </Button>
          <SignOutButton variant="ghost" />
        </nav>
      </div>
    </header>
  );
}
