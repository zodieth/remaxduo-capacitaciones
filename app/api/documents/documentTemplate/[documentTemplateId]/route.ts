import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../../../auth/_components/getSessionFunction";

// get by id

export async function GET(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documentTemplate =
      await db.documentTemplate.findUnique({
        where: {
          id: params.documentTemplateId as string,
        },
        include: {
          variables: true, // Incluye las DocumentVariable asociadas
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

// update

export async function PUT(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
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

    const documentTemplate = await db.documentTemplate.update({
      where: {
        id: params.documentTemplateId as string,
      },
      data: {
        title,
        description,
        content,
        category,
        variables: {
          connect: variablesIds.map((id: string) => ({ id })),
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

// delete
export async function DELETE(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    await db.documentTemplate.delete({
      where: {
        id: params.documentTemplateId as string,
      },
    });

    return new NextResponse("Deleted", {
      status: 200,
    });
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
