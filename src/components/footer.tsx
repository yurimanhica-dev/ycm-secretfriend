"use client"; // Necessário para usar hooks no Next.js App Router

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login"); // Redireciona para a página de login
    } else {
      console.error("Erro ao deslogar:", error.message);
    }
  };

  return (
    <button onClick={handleLogout} className="font-medium">
      Terminar a sessão
    </button>
  );
}
