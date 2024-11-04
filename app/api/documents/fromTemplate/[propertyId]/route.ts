import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";

// get de documents por propertyId
export async function GET(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documents = await db.document.findMany({
      where: {
        propertyId: params.propertyId as string,
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.log("[DOCUMENT]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
