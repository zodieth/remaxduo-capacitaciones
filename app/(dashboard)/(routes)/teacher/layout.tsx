"use client";
import { isTeacher } from "@/lib/teacher";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const TeacherLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
