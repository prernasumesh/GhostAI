import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border px-6">
      <Link href="/" className="text-sm font-semibold text-copy-primary">
        Ghost AI
      </Link>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="text-sm text-copy-secondary hover:text-copy-primary"
          >
            Dashboard
          </Link>
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
