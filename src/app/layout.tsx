import type { Metadata } from "next";
import { TrpcProvider } from "@/components/providers/TrpcProvider";
import { ProjectProvider } from "@/components/providers/ProjectProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "S&G Platform",
  description: "S&G 統合プラットフォーム - SEO & GEO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-bg text-text antialiased">
        <TrpcProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
