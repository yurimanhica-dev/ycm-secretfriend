"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend";

export type createGroupState = {
  success: null | boolean;
  message?: string;
};

export async function createGroup(
  _previostState: createGroupState,
  formData: FormData
) {
  // Get the currently logged in user
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    // If there's an error, return an object  with success set to false and a message
    return {
      success: false,
      message: "Ocorreu um erro ao criar o grupo",
    };
  }

  // Get all the value  s from the form with the name "participant" and "email"
  const names = formData.getAll("participant");
  const emails = formData.getAll("email");

  // Get the value of  the form field with the name "group-name"
  const groupName = formData.get("group-name");

  const { data: newGroup, error } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      owner_id: authUser?.user.id,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar o grupo",
    };
  }
  // Insert all the participants into the "participants" table
  const participants = names.map((name, index) => ({
    group_id: newGroup.id,
    name,
    email: emails[index],
  }));

  console.log(participants);

  const { data: createdParticipants, error: errorParticipants } = await supabase
    .from("participants")
    .insert(participants)
    .select();

  if (errorParticipants) {
    return {
      success: false,
      message: "Ocorreu um erro ao adicionar os participantes ao grupo",
    };
  }

  const drawnParticipants = drawGroup(createdParticipants);

  const { error: errorDraw } = await supabase
    .from("participants")
    .upsert(drawnParticipants);

  if (errorDraw) {
    return {
      success: false,
      message: "Ocorreu um erro ao atribuir os participantes ao grupo",
    };
  }

  const { error: errorResend } = await sendEmailToParticipants(
    drawnParticipants,
    groupName as string
  );

  if (errorResend) {
    return {
      success: false,
      message: errorResend,
    };
  }
  redirect(`/app/groups/${newGroup.id}`);
}

type Participant = {
  id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};

function drawGroup(participants: Participant[]) {
  if (participants.length < 2) {
    throw new Error(
      "É necessário pelo menos dois participantes para o sorteio."
    );
  }

  // Embaralha os participantes de forma aleatória (Fisher-Yates)
  const shuffledParticipants = [...participants];
  for (let i = shuffledParticipants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledParticipants[i], shuffledParticipants[j]] = [
      shuffledParticipants[j],
      shuffledParticipants[i],
    ];
  }

  // Realiza o sorteio garantindo que ninguém seja atribuído a si mesmo
  const results = shuffledParticipants.map((participant, index) => {
    const assignedIndex = (index + 1) % shuffledParticipants.length;
    return {
      ...participant,
      assigned_to: shuffledParticipants[assignedIndex].id,
    };
  });

  return results;
}

async function sendEmailToParticipants(
  participants: Participant[],
  groupName: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await Promise.all(
      participants.map((participant) => {
        resend.emails.send({
          from: "delivered@resend.dev",
          to: participant.email,
          subject: `🎁 Sorteio de Amigo Secreto - ${groupName} 🎉`,
          html: `
        <div style="font-family: Alexandria, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px;">
          <div style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); display: inline-block;">
            <h1 style="color: #e63946;">🎁 Sorteio de Amigo Secreto 🎉</h1>
            <p>Olá, <strong>${participant.name}</strong>! 🙌</p>
            <p>Você está participando do Amigo Secreto do grupo <strong>"${groupName}"</strong>!</p>
            <p>O grande momento chegou! O seu amigo secreto é...</p>
            <p style="font-size: 20px; font-weight: bold; color: #1d3557;">🎊 <strong>${
              participants.find((p) => p.id === participant.assigned_to)?.name
            }</strong> 🎊</p>
            <p>Agora é só preparar um presente especial e guardar segredo até a revelação! 🤐🎁</p>
            <p style="margin-top: 20px; font-size: 14px; color: #555;">Boa sorte e divirta-se! ❤️</p>
          </div>
        </div>
      `,
        });
      })
    );

    return { error: null };
  } catch {
    return { error: "Ocorreu um erro ao enviar o email" };
  }
}
