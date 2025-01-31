import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabse = await createClient();

  const { data, error } = await supabse.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="mx-auto w-full">
      <Header />
      {children}
      <Toaster />
    </div>
  );
}
