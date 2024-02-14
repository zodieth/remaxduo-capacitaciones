"use client";
import { isAdmin } from "@/lib/teacher";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const TeacherLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (!isAdmin(role)) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
