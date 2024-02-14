import "next-auth";

declare module "next-auth" {
  /**
   * Extiende los tipos de sesión para incluir los campos personalizados como `userId`.
   */
  interface Session {
    user?: {
      id?: string;
    };
  }
}
