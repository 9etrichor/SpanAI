import { dictionaries, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/layout/site-header";

interface PageShellProps {
  locale?: Locale;
  children: React.ReactNode;
}

export function PageShell({ locale = "zh-TW", children }: PageShellProps) {
  const dict = dictionaries[locale];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{dict.homeTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{dict.homeDescription}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
