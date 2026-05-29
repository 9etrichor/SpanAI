export const locales = ["zh-TW", "es"] as const;
export type Locale = (typeof locales)[number];

export const dictionaries: Record<
  Locale,
  {
    appName: string;
    homeTitle: string;
    homeDescription: string;
    nav: {
      home: string;
      query: string;
      conjugation: string;
      patterns: string;
      contexts: string;
      progress: string;
    };
  }
> = {
  "zh-TW": {
    appName: "SpanAI",
    homeTitle: "西班牙語中級學習平台",
    homeDescription: "聚焦閱讀與寫作，透過 AI 進行精準練習與回饋。",
    nav: {
      home: "首頁",
      query: "表達查詢",
      conjugation: "動詞變位",
      patterns: "句型訓練",
      contexts: "情境練習",
      progress: "學習進度"
    }
  },
  es: {
    appName: "SpanAI",
    homeTitle: "Plataforma intermedia de español",
    homeDescription: "Enfoque en lectura y escritura con práctica guiada por IA.",
    nav: {
      home: "Inicio",
      query: "Consulta",
      conjugation: "Conjugación",
      patterns: "Patrones",
      contexts: "Contextos",
      progress: "Progreso"
    }
  }
};
