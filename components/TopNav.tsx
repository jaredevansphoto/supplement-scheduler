"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const tabs = [
  { href: "/today", label: "Today" },
  { href: "/stacks", label: "Supplements" },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex gap-2">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3 py-1 rounded border ${active ? "font-semibold bg-gray-100" : "hover:bg-gray-50"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {session?.user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
