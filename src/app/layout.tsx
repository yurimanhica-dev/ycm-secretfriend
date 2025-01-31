import "@/app/globals.css";
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secret Friend",
  description: "Secret Friend",
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
