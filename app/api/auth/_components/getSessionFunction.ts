import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export const getServerSessionFunc = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const userId = session?.user?.id;
  const role = session?.user?.role || "user";
  const agentId = session?.user?.agentId;
  return { user, userId, role, agentId };
};
