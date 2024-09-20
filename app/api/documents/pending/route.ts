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

    const documents = await db.document.findMany({
      where: {
        OR: [
          {
            status: "PENDING",
          },
          {
            status: "REJECTED",
          },
        ],
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.log("[DOCUMENTS PENDING OR REJECTED]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
