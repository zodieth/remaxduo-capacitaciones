"use client";

import { useState, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertDialogWithTextareaProps {
  children: ReactNode;
  onSubmit: (value: string) => void;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
}

export default function AlertDialogWithTextarea({
  children,
  onSubmit,
  title = "Ingrese información",
  description = "Por favor, complete el siguiente campo. Es obligatorio para continuar.",
  submitText = "Enviar",
  cancelText = "Cancelar",
}: AlertDialogWithTextareaProps) {
  const [open, setOpen] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (textareaValue.trim() === "") {
      setError("Este campo es obligatorio");
    } else {
      onSubmit(textareaValue);
      setOpen(false);
      setTextareaValue("");
      setError("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-start">
            <Label htmlFor="textarea-field">
              <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-4">
              <Textarea
                id="textarea-field"
                value={textareaValue}
                onChange={e => setTextareaValue(e.target.value)}
                placeholder="Ingrese texto aquí"
                className="min-h-[100px]"
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Este campo es requerido.
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={textareaValue.trim() === ""}
          >
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
