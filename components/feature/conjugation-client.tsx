"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConjugationForm {
  pronoun: string;
  form: string;
}

interface ConjugationTense {
  name: string;
  nameZhTw: string;
  forms: ConjugationForm[];
}

interface ConjugationResultPayload {
  infinitive: string;
  englishMeaning: string;
  verbType: string;
  notesZhTw: string;
  tenses: ConjugationTense[];
}

const verbTypeLabels: Record<string, string> = {
  "regular-ar": "規則 -ar",
  "regular-er": "規則 -er",
  "regular-ir": "規則 -ir",
  irregular: "不規則",
  "stem-changing": "詞幹變化",
  reflexive: "反身動詞"
};

export function ConjugationClient() {
  const [verb, setVerb] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConjugationResultPayload | null>(null);

  const submitDisabled = useMemo(() => isLoading || verb.trim().length === 0, [isLoading, verb]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/conjugation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user"
        },
        body: JSON.stringify({
          verb: verb.trim(),
          locale: "zh-TW"
        })
      });

      const rawText = await response.text();
      let payload: (
        | { ok: true; data: { parsed: ConjugationResultPayload } }
        | { ok: false; error?: string }
      ) | null = null;

      try {
        payload = JSON.parse(rawText) as
          | { ok: true; data: { parsed: ConjugationResultPayload } }
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
          <CardTitle>動詞變位查詢</CardTitle>
          <CardDescription>輸入西班牙語動詞原形（如 tener、hablar），查看各時態變位。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <label htmlFor="verb" className="block text-sm font-medium">
              動詞
            </label>
            <input
              id="verb"
              type="text"
              value={verb}
              onChange={(e) => setVerb(e.target.value)}
              placeholder="例如：tener、ser、hablarse"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
              spellCheck={false}
            />
            <Button type="submit" disabled={submitDisabled}>
              {isLoading ? "查詢中..." : "查詢變位"}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{result.infinitive}</CardTitle>
              <CardDescription>
                {result.englishMeaning}
                {result.verbType && (
                  <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">
                    {verbTypeLabels[result.verbType] ?? result.verbType}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            {result.notesZhTw && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.notesZhTw}</p>
              </CardContent>
            )}
          </Card>

          {result.tenses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">無法產生變位表，請確認輸入為有效的西班牙語動詞。</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {result.tenses.map((tense) => (
                <Card key={tense.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{tense.nameZhTw || tense.name}</CardTitle>
                    {tense.nameZhTw && tense.name !== tense.nameZhTw && (
                      <CardDescription className="text-xs">{tense.name}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <tbody>
                        {tense.forms.map((row, index) => (
                          <tr key={`${row.pronoun}-${index}`} className="border-b last:border-0">
                            <td className="py-1.5 pr-4 text-muted-foreground">{row.pronoun}</td>
                            <td className="py-1.5 font-medium">{row.form}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
