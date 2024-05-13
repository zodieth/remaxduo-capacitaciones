// create new DocumentTemplate

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const {
      title,
      description,
      content,
      category,
      variablesIds,
    } = await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documentTemplate = await db.documentTemplate.create({
      data: {
        title,
        description,
        content,
        category,
        variables: {
          connect: variablesIds.map((id: string) => {
            return { id };
          }),
        },
      },
    });

    return NextResponse.json(documentTemplate);
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const documentTemplates = await db.documentTemplate.findMany(
      {
        include: {
          variables: true, // Incluye las DocumentVariable asociadas
        },
      }
    );

    return NextResponse.json(documentTemplates);
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
