import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (credentials) {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              image: true,
              role: true,
            },
          });

          if (!user)
            throw new Error(
              JSON.stringify({
                message: "No user found",
                ok: false,
              })
            );

          const matchPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!matchPassword) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    NextAuthX: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      console.log("jwt", token);
      console.log("user", user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("token", token);
      return token;
    },

    async session({ session, token }: any) {
      console.log("session", session);
      console.log("token", token);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
