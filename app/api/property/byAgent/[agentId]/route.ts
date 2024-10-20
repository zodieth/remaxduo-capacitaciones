import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";

export async function GET(
  req: Request,
  { params }: { params: { agentId: string } }
) {
  try {
    const { userId, role: userRole } =
      await getServerSessionFunc();
    const { agentId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const properties = await db.property.findMany({
      where: {
        agentId,
      },
    });

    const propertiesWithPhotos = properties.map(property => {
      return {
        ...property,
        photos: JSON.parse(property.photos),
      };
    });

    return NextResponse.json(propertiesWithPhotos);
  } catch (error) {
    console.log("[PROPERTY]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
