"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";

import Image from "next/image";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess} from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shareDocumentHandler = async () => {
    setLoading(true);
    setErrorMessage(null); // Reinicia el error antes de ejecutar

    // Validar si el usuario existe en Clerk
    const users = await getClerkUsers({ userIds: [email] });

    if (!users || users.length === 0 || users[0] === null) {
      setErrorMessage(`No se ha encontrado la cuenta asociada al correo ${email}`);
      setLoading(false);
      return;
    }

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    });

    setLoading(false);
    setEmail(""); // Limpiar campo de email después de compartir
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4"
          disabled={currentUserType !== "editor"}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Compartir</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Maneja quien puede ver este proyecto</DialogTitle>
          <DialogDescription>
            Selecciona qué usuarios pueden ver y editar este proyecto
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="email" className="mt-6 text-blue-100">
          Correo electrónico
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Ingresa una dirección de correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Compartir"}
          </Button>
        </div>

        {errorMessage && (
          <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
        )}

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
