import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";

// get de documents por propertyId
export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const document = await db.document.findFirst({
      where: {
        id: params.documentId as string,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
