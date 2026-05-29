import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "表達查詢",
    description: "中文概念 -> 多種西語表達、變體、例句與使用場景。",
    href: "/query" as const
  },
  {
    title: "動詞變位",
    description: "輸入動詞原形，查看各時態人稱變位與學習提示。",
    href: "/conjugation" as const
  },
  {
    title: "句型訓練",
    description: "依句型自動生成大量變化例句，並支援互動批改。",
    href: "/patterns" as const
  },
  {
    title: "情境練習",
    description: "針對真實情境寫作，取得語法、自然度與文化適切性回饋。",
    href: "/contexts" as const
  }
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={feature.href}>
                <Button>開始使用</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
