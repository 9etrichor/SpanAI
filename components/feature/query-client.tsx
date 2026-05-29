"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QueryVariant {
  text: string;
  region: "Spain" | "LatinAmerica" | "Neutral" | string;
  usageNote: string;
}

interface QueryResultPayload {
  mainTranslation: string;
  variants: QueryVariant[];
  examples: string[];
  situations: string[];
  regionalDifferences: string[];
}

export function QueryClient() {
  const [concept, setConcept] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResultPayload | null>(null);

  const submitDisabled = useMemo(() => isLoading || concept.trim().length === 0, [isLoading, concept]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user"
        },
        body: JSON.stringify({
          concept: concept.trim(),
          locale: "zh-TW"
        })
      });

      const rawText = await response.text();
      let payload: (
        | { ok: true; data: { parsed: QueryResultPayload } }
        | { ok: false; error?: string }
      ) | null = null;

      try {
        payload = JSON.parse(rawText) as
          | { ok: true; data: { parsed: QueryResultPayload } }
          | { ok: false; error?: string };
      } catch {
        throw new Error("伺服器回傳非 JSON（通常是後端設定或環境變數錯誤）。");
      }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? `Query failed (${response.status}).` : payload.error ?? "Query failed.");
      }

      setResult(payload.data.parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "查詢失敗，請稍後重試。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>表達查詢 (Expression Query)</CardTitle>
          <CardDescription>輸入中文詞彙或概念，取得多種西班牙語表達與使用差異。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <label htmlFor="concept" className="block text-sm font-medium">
              中文詞彙 / 概念
            </label>
            <textarea
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="例如：奶茶、我很忙、先看看再說"
              className="min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" disabled={submitDisabled}>
              {isLoading ? "查詢中..." : "開始查詢"}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>主要翻譯</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium">{result.mainTranslation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>變體表達</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.variants.map((variant, index) => (
                <div key={`${variant.text}-${index}`} className="rounded-md border p-3">
                  <p className="font-medium">{variant.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">地區：{variant.region}</p>
                  <p className="mt-1 text-sm">{variant.usageNote}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>例句（至少 3 句）</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.examples.map((example, index) => (
                  <li key={`${example}-${index}`}>{example}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用情境</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.situations.map((situation, index) => (
                  <li key={`${situation}-${index}`}>{situation}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>地域差異註記</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {result.regionalDifferences.map((difference, index) => (
                  <li key={`${difference}-${index}`}>{difference}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
