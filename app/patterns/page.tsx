import { PageShell } from "@/components/layout/page-shell";
import { FeaturePlaceholder } from "@/components/feature/feature-placeholder";

export default function PatternsPage() {
  return (
    <PageShell>
      <FeaturePlaceholder
        title="句型重複訓練 (Pattern Drilling)"
        description="選擇句型後自動生成 10-15 句變化例句，並提供互動練習與即時批改。"
        nextStep="建立句型清單、練習題資料結構與批改 API。"
      />
    </PageShell>
  );
}
