"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

interface NewProfileModalProps {
  trigger: React.ReactNode;
  onCreate: (profileName: string) => void;
}

export const NewProfileModal = ({
  trigger,
  onCreate,
}: NewProfileModalProps) => {
  const [newProfileName, setNewProfileName] = useState("");

  const handleCreateProfile = () => {
    onCreate(newProfileName);
    setNewProfileName("");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear nuevo perfil</AlertDialogTitle>
        </AlertDialogHeader>

        <Input
          type="text"
          placeholder="Nombre del perfil"
          value={newProfileName}
          onChange={(e: any) =>
            setNewProfileName(e.target.value)
          }
          className="w-full"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateProfile}>
            Crear Perfil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
