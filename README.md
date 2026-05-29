# SpanAI

Next.js 14 (App Router) + TypeScript + Tailwind CSS 的西班牙語學習平台骨架專案。

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS + shadcn/ui 風格元件
- DeepSeek API
- Supabase (`@supabase/supabase-js`)
- Node.js 20 LTS（建議 20.11+）

## Setup

1. 複製環境變數：
   - `cp .env.example .env.local`（Windows 可改用手動建立）
2. 填入 DeepSeek 金鑰（Supabase 若使用預設 placeholder，系統會自動略過用量記錄）。
3. 安裝依賴：`npm install`
4. 啟動開發：`npm run dev`

## 目前完成

- 標準 App Router 結構
- 主要頁面：
  - `/`
  - `/query`
  - `/conjugation`
  - `/patterns`
  - `/contexts`
  - `/progress`
- AI 呼叫中介層：`lib/ai.ts`
- Prompt 模板系統：`lib/prompts.ts`
- Token usage 與每日限制：`lib/usage.ts`
- API routes：
  - `POST /api/ai/query`
  - `POST /api/ai/conjugation`
  - `POST /api/ai/patterns`
  - `POST /api/ai/contexts`
- Supabase schema：`supabase/schema.sql`

## 接下來開發順序（建議）

1. 先完成 `Expression Query` 前端互動（表單、loading、錯誤、結果卡片）
2. 再做 `Pattern Drilling` 的題型互動與即時批改流程
3. 最後做 `Context Practice` 寫作工作流與結構化評分呈現