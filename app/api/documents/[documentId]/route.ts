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

// delete
export async function DELETE(
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

    await db.document.delete({
      where: {
        id: params.documentId as string,
      },
    });

    return new NextResponse("Document deleted", {
      status: 200,
    });
  } catch (error) {
    console.log("[DOCUMENT]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

// update document
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: { documentId: string };
  }
) {
  const body = await req.json();

  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const edittingText =
      body.status === "APPROVED" ? "" : body.whyIsEditting;

    const document = await db.document.update({
      where: {
        id: params.documentId as string,
      },
      data: {
        content: body.content ? body.content : undefined,
        status: body.status,
        whyIsEditting: edittingText,
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
