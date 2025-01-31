import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TextRevealCard,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";
import { createClient } from "@/utils/supabase/server";

export default async function GroupIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: autUser } = await supabase.auth.getUser();

  const groupId = (await params).id;

  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .select(`name, participants(*)`)
    .eq("id", groupId)
    .single();

  if (groupError) {
    return <p>Erro ao pegar os dados do grupo</p>;
  }

  const { data: userGroups, error: userError } = await supabase
    .from("participants")
    .select(`id, name, create_at, email`)
    .eq("email", autUser?.user?.email);

  if (userError) {
    return <p>Erro ao pegar o usuário logado: {userError.message}</p>;
  }

  const assignedParticipantsId = groupData.participants.find(
    (p) => autUser?.user?.email === p.email
  )?.assigned_to;

  const assignedParticipant = groupData.participants.find(
    (p) => p.id === assignedParticipantsId
  );

  return (
    <main className="container mx-auto py-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">
              Nome do grupo: {""}
              <span className="text-primary font-bold">{groupData.name}</span>
            </CardTitle>
            <CardDescription className="mt-4 space-y-2">
              <p>
                Informações do grupo e participantes <br />
              </p>
              <Separator />
              {userGroups.map((group) => (
                <p className="text-md" key={group.id}>
                  Autenticado como: {group.name}
                </p>
              ))}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold -mb-3">Participantes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupData.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator />

          <TextRevealCard
            className="w-full my-auto"
            text="Passe  mouse para revelar"
            revealText={assignedParticipant?.name}
          >
            <TextRevealCardTitle>Seu amigo secreto</TextRevealCardTitle>
          </TextRevealCard>
        </CardContent>
      </Card>
    </main>
  );
}
