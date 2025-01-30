"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // Obtén los usuarios desde Clerk
    const client = await clerkClient();
    const response = await client.users.getUserList({
      emailAddress: userIds,
    });
    const users = response.data;

    // Transforma la respuesta de Clerk
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.emailAddresses[0]?.emailAddress || "Unknown email",
      avatar: user.imageUrl || "",
    }));

    // Ordena los usuarios en el mismo orden que los userIds proporcionados
    const sortedUsers = userIds.map(
      (email) => formattedUsers.find((user) => user.email === email) || null
    );

    // Elimina usuarios no encontrados y devuelve los resultados
    return parseStringify(sortedUsers.filter(Boolean));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching users: ${error.message}`);
    } else {
      console.error("Error fetching users:", error);
    }
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const loweCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(loweCaseText)
      );

      return parseStringify(filteredUsers);
    }
  } catch (error) {
    console.log("Error fetching document users:", error);
  }
};
