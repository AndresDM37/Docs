"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // Obtén los usuarios desde Clerk
    const users = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });

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
    console.error(`Error fetching users: ${error.message}`);
    return []; // Devuelve un array vacío en caso de error
  }
};
