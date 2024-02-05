import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

export const DeleteConfirmationDialog = ({
  openDialog,
  setOpenDialog,
  confirmDelete,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDelete: () => void;
}) => {
  return (
    <>
      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Trigger asChild />
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed p-4 bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="font-bold text-xl">
              Confirmar Eliminación
            </Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro de que deseas eliminar esta categoría?
            </Dialog.Description>
            <div className="flex justify-end space-x-2 mt-5">
              <Dialog.Close asChild>
                <Button className="button">Cancelar</Button>
              </Dialog.Close>
              <Button
                onClick={confirmDelete}
                className="button-danger bg-red-500"
              >
                Eliminar
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
