import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpanAI",
  description: "西班牙語中級學習平台"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
