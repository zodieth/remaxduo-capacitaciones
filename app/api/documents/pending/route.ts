import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";

// get de documents por status pending y rejected
export async function GET(req: Request, res: Response) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    // Obtener documentos pendientes
    const documents = await db.document.findMany({
      where: { status: "PENDING" },
    });

    // Obtener IDs de usuarios
    const userIds = documents.map(doc => doc.createdBy);

    // Obtener usuarios correspondientes
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    // Crear un mapa de usuarios
    const userMap: Record<string, string> = users.reduce(
      (acc, user) => {
        acc[user.id] = user.name || "Desconocido"; // Maneja el caso donde user.name es null
        return acc;
      },
      {} as Record<string, string>
    );

    // Combinar documentos con nombres de usuarios
    const documentsWithUserName = documents.map(doc => ({
      ...doc,
      userName: userMap[doc.createdBy] || "Sistema",
    }));

    return NextResponse.json(documentsWithUserName);
  } catch (error) {
    console.log("[DOCUMENTS PENDING OR REJECTED]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
