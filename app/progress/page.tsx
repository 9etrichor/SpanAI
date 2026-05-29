import { PageShell } from "@/components/layout/page-shell";
import { FeaturePlaceholder } from "@/components/feature/feature-placeholder";

export default function ProgressPage() {
  return (
    <PageShell>
      <FeaturePlaceholder
        title="個人進度 (Progress)"
        description="查看每日練習次數、句型掌握度、常見錯誤與 token 使用量。"
        nextStep="串接 Supabase，呈現使用者歷史與統計圖表。"
      />
    </PageShell>
  );
}
