import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export const getServerSessionFunc = async () => {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  const role = session.user.role;
  return { userId, role };
};
