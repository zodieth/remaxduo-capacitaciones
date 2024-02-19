"use client";

import { Logo } from "@/app/(dashboard)/_components/logo";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const errorMessageHandler = (message: string) => {
  switch (message) {
    case "No user found":
      return "No se encontró el usuario";
    case "CredentialsSignin":
      return "Contraseña inválida";
    default:
      return "Error al iniciar sesión";
  }
};

type LoginFormInputs = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().min(1, "Ingrese un email válido"),
  password: z.string().min(1, "Ingrese una contraseña válida"),
});

const LoginPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(formSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<
    LoginFormInputs
  > = async data => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    res && !res.ok && setIsLoading(false);

    if (res?.ok) router.refresh();

    if (res && !res.ok && res.error) {
      let errorMessage = "Error desconocido";

      // Intentar analizar el error si está en formato JSON
      try {
        const errorObject = JSON.parse(res.error);
        if (errorObject && errorObject.message) {
          errorMessage = errorObject.message;
        }
      } catch (e) {
        errorMessage = res.error;
      }
      setErrorMessage(errorMessageHandler(errorMessage));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-12 rounded-lg shadow-lg w-2/3 md:w-1/3"
        >
          <div className="flex justify-center mb-16 mt-6">
            <Logo />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Mensaje de error */}
          {errorMessage && (
            <div
              className="m-5 flex items-center p-4 mb-4 bg-red-100 border-t-4 border-red-500 rounded-lg shadow-md"
              role="alert"
            >
              <XCircle className="h-4 w-4 mr-2 text-red-800" />
              <span className="text-red-800 text-sm font-medium">
                {errorMessage}
              </span>
            </div>
          )}

          <div className="m-5">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...register("email")}
                />
              </FormControl>
              {errors.email && (
                <FormMessage>{errors.email.message}</FormMessage>
              )}
            </FormItem>
          </div>

          <div className="m-5">
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contraseña"
                  {...register("password")}
                />
              </FormControl>
              {errors.password && (
                <FormMessage>
                  {errors.password.message}
                </FormMessage>
              )}
            </FormItem>
          </div>

          <div className="m-5">
            <Button
              type="submit"
              className="mt-6 w-full bg-blue-950 text-white text-lg py-3 rounded-md hover:bg-blue-700"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
