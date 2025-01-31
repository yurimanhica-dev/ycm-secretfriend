import Header from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <h1 className="text-4xl font-bold">Bem-vindo ao Secret Friend.</h1>
        <p className="text-lg mt-4">
          Conta pertencente ao email: {data.user.email}
        </p>
      </div>
    </>
  );
}
