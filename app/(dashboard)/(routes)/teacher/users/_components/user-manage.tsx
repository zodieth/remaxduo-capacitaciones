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
  role: z
    .string()
    .nonempty("El rol no puede estar vacío")
    .default("USER"),
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

export type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
};

type UserManagementProps = {
  onCancel: (value: boolean) => void;
  user?: User | undefined;
};

const api = {
  createUser: async (user: User) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      toast.error("Error al crear el usuario");
      throw new Error("Error al crear el usuario");
    }
    return response.json();
  },
  updateUser: async (user: User) => {
    const response = await fetch(`/api/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      toast.error("Error al actualizar el usuario");
      throw new Error("Error al actualizar el usuario");
    }
    return response.json();
  },
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }
  },
};

export const UserManagement = ({
  onCancel,
  user,
}: UserManagementProps) => {
  const [editUser, setEditUser] = useState<User | undefined>(
    user
  );
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
      name: (user as User)?.name,
      email: (user as User)?.email,
      role: (user as User)?.role,
      password: undefined,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
    if (!user) {
      //TODO crear user
      api.createUser(data);
      toast.success("Usuario creado");
    } else {
      //TODO edit user
      // update
      // const userId = users[editingId].id;
      // const updatedUser = users.map((user, index) =>
      //   index === editingId
      //     ? {
      //         ...user,
      //         name: data.name,
      //         email: data.email,
      //         role: data.role,
      //         password: data.password,
      //       }
      //     : user
      // );
      // setUsers(updatedUser);
      toast.success("Usuario actualizado");
    }
    onCancel(true);
    reset({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  };

  const handleDelete = (index: number) => {
    //TODO delete user
  };

  const onCancelEdit = () => {
    setEditUser(undefined);
    reset({
      name: "",
      email: "",
      role: "",
      password: "",
    });
    onCancel(true);
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
                value={(user as User)?.name}
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
                value={(user as User)?.email}
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
                value={(user as User)?.role}
                className="input border w-fit py-2 px-1 rounded-md"
              >
                <option value="USER">Agente</option>
                <option value="ADMIN">Administrador</option>
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
              {!user ? "Crear Usuario" : "Actualizar Usuario"}
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
