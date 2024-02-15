"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/app/(dashboard)/_components/logo";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<
    LoginFormInputs
  > = async data => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-lg" // Aumentado padding y sombra
      >
        <h2 className="text-3xl font-bold mb-10 text-center">
          {" "}
        </h2>

        <div className="mb-6">
          {" "}
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700" // Aumentado tamaño de texto
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-lg sm:text-lg border-gray-300 rounded-md" // Aumentado margin-top, sombra y tamaño de texto
          />
          {errors.email && (
            <span className="text-sm text-red-500"> </span>
          )}
        </div>

        <div className="mb-8">
          {" "}
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700" // Aumentado tamaño de texto
          >
            Contraseña
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-lg sm:text-lg border-gray-300 rounded-md" // Aumentado margin-top, sombra y tamaño de texto
          />
          {errors.password && (
            <span className="text-sm text-red-500"> </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white text-lg py-3 rounded hover:bg-indigo-700" // Aumentado padding vertical y tamaño de texto
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
