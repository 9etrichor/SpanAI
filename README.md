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

## Cloudflare Pages Deployment

### Prerequisites
- Cloudflare account with Pages access
- Node.js 20.11+ installed locally

### Deployment Steps

1. **Install Cloudflare dependencies:**
   ```bash
   npm install --save-dev @cloudflare/next-on-pages wrangler
   ```

2. **Build for Cloudflare Pages:**
   ```bash
   npm run pages:build
   ```

3. **Deploy to Cloudflare Pages:**
   ```bash
   npm run pages:deploy
   ```

### Environment Variables
Set these in Cloudflare Pages dashboard (Settings > Environment variables):
- `DEEPSEEK_API_KEY` - Your DeepSeek API key
- `DEEPSEEK_BASE_URL` - DeepSeek API endpoint (default: https://api.deepseek.com/v1)
- `DEEPSEEK_MODEL` - Model name (default: deepseek-chat)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_DEFAULT_LOCALE` - Default locale (default: zh-TW)
- `DAILY_TOKEN_LIMIT` - Daily token limit per user (default: 120000)

### Git Integration (Alternative)
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run pages:build`
3. Set output directory: `.vercel/output/static`
4. Configure environment variables in dashboard
5. Cloudflare will auto-deploy on push

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