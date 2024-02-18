"use client";
import { isAdmin } from "@/lib/isAdminCheck";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const TeacherLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      !isAdmin(session?.user?.role)
    ) {
      console.log("No es admin");
      router.push("/");
    }
  }, [status, session?.user?.role, router]);

  if (status === "loading") {
    return (
      <div className="mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  return status === "authenticated" &&
    isAdmin(session?.user?.role) ? (
    <>{children}</>
  ) : null;
};

export default TeacherLayout;
