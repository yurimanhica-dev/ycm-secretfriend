import "@/app/globals.css";
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Next.js App",
  description: "Aplicação padrão com Next.js 13+",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${alexandria.className} dark antialiased`}>
        {children}
      </body>
    </html>
  );
}
