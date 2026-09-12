import Link from "next/link";
import { signOutAction } from "@/lib/auth/actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            Journal &amp; Learn
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Dashboard
            </Link>
            <Link href="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Settings
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
