import { PageShell } from "@/components/layout/page-shell";
import { FeaturePlaceholder } from "@/components/feature/feature-placeholder";

export default function ContextsPage() {
  return (
    <PageShell>
      <FeaturePlaceholder
        title="特定語境訓練 (Context Practice)"
        description="依常見情境引導寫作，並提供語法、自然度、詞彙與文化適切性評估。"
        nextStep="建立情境模板資料與結構化評分回傳格式。"
      />
    </PageShell>
  );
}
