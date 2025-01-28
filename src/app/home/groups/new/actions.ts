"use server";

import { createClient } from "@/utils/supabase/server";

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
  // redirect(`app/groups/${newGroup.id}`);
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
