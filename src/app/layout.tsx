import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
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
      <body className={`${alexandria.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
