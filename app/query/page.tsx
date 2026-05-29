import { PageShell } from "@/components/layout/page-shell";
import { QueryClient } from "@/components/feature/query-client";

export default function QueryPage() {
  return (
    <PageShell>
      <QueryClient />
    </PageShell>
  );
}
