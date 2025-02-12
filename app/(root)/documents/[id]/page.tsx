import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0]?.emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const usersData = users
    .filter((user: User | null) => user !== null && user !== undefined)
    .map((user: User) => {
      const userAccess = room.usersAccesses[user?.email];

      if (!userAccess) {
        alert(`No se ha encontrado la cuenta asociada al correo ${user.email}`);
        return {
          ...user,
          userType: "desconocido",
          errorMessage: `No se ha encontra do la cuenta`,
        };
      }

      return {
        ...user,
        userType: userAccess.includes("room:write") ? "editor" : "viewer",
      };
    });

  const currentUserEmail = clerkUser.emailAddresses[0]?.emailAddress;
  const currentUserType = room.usersAccesses[currentUserEmail]?.includes(
    "room:write"
  )
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
