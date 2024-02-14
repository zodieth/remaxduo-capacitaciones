"use client";

import { Logo } from "@/app/(dashboard)/_components/logo";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

export const LoginPage = () => {
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
        className="bg-white p-12 rounded-lg shadow-lg w-2/3 md:w-1/3"
      >
        <div className="flex justify-center mb-16 mt-6">
          <Logo />
        </div>
        <div className="mb-6">
          {" "}
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="py-2 px-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border border-gray-300 rounded-md"
          />
          {errors.email && (
            <span className="text-sm text-red-500"> </span>
          )}
        </div>

        <div className="mb-8">
          {" "}
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="py-2 px-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border border-gray-300 rounded-md"
          />
          {errors.password && (
            <span className="text-sm text-red-500"> </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-950 text-white text-lg py-3 rounded-md hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
