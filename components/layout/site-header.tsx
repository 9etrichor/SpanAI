"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname();
  const dict = dictionaries[locale];

  const navItems = [
    { href: "/", label: dict.nav.home },
    { href: "/query", label: dict.nav.query },
    { href: "/conjugation", label: dict.nav.conjugation },
    { href: "/patterns", label: dict.nav.patterns },
    { href: "/contexts", label: dict.nav.contexts },
    { href: "/progress", label: dict.nav.progress }
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          {dict.appName}
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
