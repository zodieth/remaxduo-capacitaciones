import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { name, value, description, referenceTo } =
      await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documentVariable = await db.documentVariable.create({
      data: {
        name,
        value,
        description,
        referenceTo,
      },
    });

    return NextResponse.json(documentVariable);
  } catch (error) {
    console.log("[DOCUMENT VARIABLE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const documentVariables =
      await db.documentVariable.findMany();

    return NextResponse.json(documentVariables);
  } catch (error) {
    console.log("[DOCUMENT VARIABLE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { id, name, value, description, referenceTo } =
      await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documentVariable = await db.documentVariable.update({
      where: { id },
      data: { name, value, description, referenceTo },
    });

    return NextResponse.json(documentVariable);
  } catch (error) {
    console.log("[DOCUMENT VARIABLE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { id } = await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    await db.documentVariable.delete({
      where: { id },
    });

    return new NextResponse("Document variable deleted");
  } catch (error) {
    console.log("[DOCUMENT VARIABLE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
