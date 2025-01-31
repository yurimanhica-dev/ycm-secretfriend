import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { Calendar } from "lucide-react";

import Link from "next/link";

export default async function GroupPage() {
  const supabase = await createClient();

  const { data: authUser } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("groups")
    .select(`id, name, owner_id, create_at, participants!inner(email)`)
    .eq("participants.email", authUser?.user?.email);

  if (error) {
    return <p>Erro ao carregar o grupo</p>;
  }

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Meus Grupos</h1>

      {!data.length && (
        <p>
          Você ainda não possui grupos, clique em{" "}
          <Link href="/home/groups/new" className="text-primary underline">
            Novo Grupo
          </Link>{" "}
          para criar um.
        </p>
      )}

      {data.length > 0 && (
        <div className="flex justify-between items-center gap-4">
          <span className="text-sm font-medium text-gray-200">
            Total de grupos: {data.length}
          </span>
        </div>
      )}
      <Separator className="my-4" />
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((group) => (
            <Link
              key={group.id}
              href={`/home/groups/${group.id}`}
              className="cursor-pointer"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground space-x-1">
                    <Calendar />{" "}
                    <p>
                      Criado em:{" "}
                      {new Date(group.create_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">
                      Número de participantes: {group.participants.length + 1}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
