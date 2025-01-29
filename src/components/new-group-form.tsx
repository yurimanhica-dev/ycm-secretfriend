"use client";

import { createGroup, createGroupState } from "@/app/home/groups/new/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader, Mail, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface Participant {
  name: string;
  email: string;
}
export default function NewGroupForm({
  loggedUser,
}: {
  loggedUser: { email: string; id: string };
}) {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: loggedUser?.email },
  ]);

  const [groupName, setGroupName] = useState("");

  const [state, formAction, pending] = useActionState<
    createGroupState,
    FormData
  >(createGroup, {
    success: null,
    message: "",
  });
  function updateParticipants(
    index: number,
    field: keyof Participant,
    value: string
  ) {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  }

  function removeParticipant(index: number) {
    setParticipants(participants.filter((_, i) => i !== index));
  }
  function addParticipant() {
    setParticipants(participants.concat({ name: "", email: "" }));
  }

  useEffect(() => {
    if (state.success === false) {
      toast({
        variant: "destructive",
        title: "Erro ao criar grupo",
        description: state.message,
      });
    }
  }, [state]);

  return (
    <Card className="mx-auto max-w-2xl w-full">
      <CardHeader>
        <CardTitle>Novo grupo</CardTitle>
        <CardDescription>
          Crie um novo grupo para sua comunidade.
        </CardDescription>
        <form action={formAction} className="pt-4">
          <CardContent className="space-y-4 p-0 m-0">
            <div className="space-y-2">
              <Label htmlFor="group-name">Nome do grupo:</Label>
              <Input
                id="group-name"
                name="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Digite o nome do grupo"
                required
              />
            </div>
            <h2 className="!mt-10">Participantes</h2>
            {participants.map((participant, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4 "
              >
                <div className="w-full">
                  <Label htmlFor={`participant-${index}`}>Nome:</Label>
                  <Input
                    className="mt-2"
                    id={`participant-${index}`}
                    name={`participant`}
                    value={participant.name}
                    onChange={(e) => {
                      updateParticipants(index, "name", e.target.value);
                    }}
                    placeholder="Digite o nome da pessoa"
                    required
                  />
                </div>

                <div className=" w-full">
                  <Label htmlFor={`email-${index}`}>Email:</Label>
                  <Input
                    id={`email-${index}`}
                    name="email"
                    type="email"
                    value={participant.email}
                    onChange={(e) => {
                      updateParticipants(index, "email", e.target.value);
                    }}
                    className="readonly: text-muted-foreground mt-2"
                    readOnly={participant.email === loggedUser?.email}
                    placeholder="Digite o email da pessoa"
                    required
                  />
                </div>
                <div className="min-w-9">
                  {participants.length > 1 &&
                    participant.email !== loggedUser?.email && (
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        className=" text-white bg-purple-600 hover:bg-purple-500 py-2 px-4 rounded-md"
                        onClick={() => {
                          removeParticipant(index);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </CardContent>
          <Separator className="my-5 w-full" />
          <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <Button
              type="submit"
              variant="outline"
              onClick={addParticipant}
              className="w-full md:w-auto"
            >
              Adicionar participantes
            </Button>
            <Button
              type="submit"
              className="flex items-center space-x-2 w-full md:w-auto"
            >
              <Mail className="w-3 h-3" />
              Criar grupos e enviar emails
              {pending && <Loader className="animate-spin" />}
            </Button>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
}
