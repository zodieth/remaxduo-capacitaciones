"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  name: z.string().nonempty("El nombre no puede estar vacío"),
  email: z
    .string()
    .email("El email no es válido")
    .min(1, "El email no puede estar vacío"),
  role: z.string().nonempty("El rol no puede estar vacío"),
  password: z
    .string()
    .nonempty("La contraseña no puede estar vacía"),
});

interface FormValues {
  name: string;
  email: string;
  role: string;
  password: string;
}

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
};

type UserManagementProps = {
  onCancel: (value: boolean) => void;
};

export const UserManagement = ({
  onCancel,
}: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingIndex, setEditingIndex] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<
    number | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
    if (editingIndex === null) {
      // create
      const newUser = {
        id: "1",
        ...data,
      };
      setUsers([newUser, ...users]);
      toast.success("Usuario creado");
    } else {
      // update
      const userId = users[editingIndex].id;
      const updatedUser = users.map((user, index) =>
        index === editingIndex
          ? {
              ...user,
              name: data.name,
              email: data.email,
              role: data.role,
              password: data.password,
            }
          : user
      );
      setUsers(updatedUser);
      setEditingIndex(null);
      toast.success("Usuario actualizado");
    }
    reset({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    reset({
      name: users[index].name,
      email: users[index].email,
      role: users[index].role,
      password: users[index].password,
    });
  };

  const handleDelete = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const onCancelEdit = () => {
    onCancel(false);
    setEditingIndex(null);
    reset({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  };

  const onDelete = () => {
    setIsLoading(true);
    if (linkToDelete !== null) {
      handleDelete(linkToDelete);
    }
    toast.success("Usuario eliminado");
    setLinkToDelete(null);
  };

  return (
    <div className="mt-4 absolute top-10 right-0 border border-solid bg-white shadow-lg rounded-md p-4 w-[400px] md:w-[700px] min-h-1/2">
      <h1 className="text-lg font-semibold mb-2">Usuario:</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                id="name"
                placeholder="Nombre y Apellido"
                {...register("name")}
              />
            </FormControl>
            {errors.name && (
              <FormMessage>{errors.name.message}</FormMessage>
            )}
          </FormItem>
          <FormItem className="mt-4">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                id="email"
                placeholder="ejemplo@email.com"
                {...register("email")}
              />
            </FormControl>
            {errors.email && (
              <FormMessage>{errors.email.message}</FormMessage>
            )}
          </FormItem>
          <FormItem className="mt-4 flex flex-col">
            <FormLabel>Rol</FormLabel>
            <FormControl>
              <select
                id="role"
                {...register("role")}
                className="input border w-fit py-2 px-1 rounded-md"
              >
                <option value="agente">Agente</option>
                <option value="administrador">
                  Administrador
                </option>
              </select>
            </FormControl>
            {errors.role && (
              <FormMessage>{errors.role.message}</FormMessage>
            )}
          </FormItem>
          <FormItem className="mt-4">
            <FormLabel>Contraseña</FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  {...register("password")}
                />
              </FormControl>
              <button
                type="button"
                onClick={toggleShowPassword}
                className="ml-2 focus:outline-none text-right"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <FormMessage>
                {errors.password.message}
              </FormMessage>
            )}
          </FormItem>
          <div className="flex mt-4">
            <Button type="submit" className="mr-3">
              {editingIndex === null
                ? "Crear Usuario"
                : "Actualizar Usuario"}
            </Button>
            <Button
              type="button"
              className="bg-slate-200 text-black"
              onClick={() => onCancelEdit()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
