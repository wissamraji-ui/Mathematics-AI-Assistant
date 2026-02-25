import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/app" className="no-underline">
          <div className="font-semibold tracking-tight">Mathematics AI Assistant</div>
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

