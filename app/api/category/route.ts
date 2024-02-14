import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/teacher";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();

    const { name } = await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const category = await db.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await db.category.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORY]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { id, name } = await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const category = await db.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY]", error);
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

    await db.category.delete({ where: { id } });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.log("[CATEGORY]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
