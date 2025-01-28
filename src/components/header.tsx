import { Gift, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link
            href="/home"
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Gift className="h-6 w-6 text-purple-400" />
            <span className="font-bold">Amigo Secreto</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="home/groups"
              className=" text-foreground text-sm flex gap-2 items-center"
            >
              <UsersRound className="h-6 w-6"></UsersRound>
              Meus grupos
            </Link>

            <Button
              asChild
              variant="outline"
              className="bg-transparent border-[1.5px] border-white"
            >
              <Link href="home/groups/new">Novo grupo</Link>
            </Button>
          </nav>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-[1.5px] border-white"
          >
            <Link href="/login">Sair</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
