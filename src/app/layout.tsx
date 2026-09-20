import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { TtsProvider } from "@/components/TtsProvider";

export const metadata: Metadata = {
  title: "A1 Deutsch Trainer",
  description:
    "面向中国成年零基础德语学习者的 A1 地基 + A1 考试过关 + 长期记忆训练系统。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2f6f6b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <StoreProvider>
          <TtsProvider>{children}</TtsProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
