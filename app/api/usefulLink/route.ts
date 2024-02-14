import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const { title, url, description } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const usefulLink = await db.usefulLink.create({
      data: {
        title,
        url,
        description,
      },
    });

    return NextResponse.json(usefulLink);
  } catch (error) {
    console.log("[USEFUL LINK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const usefulLinks = await db.usefulLink.findMany();

    return NextResponse.json(usefulLinks);
  } catch (error) {
    console.log("[USEFUL LINK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const { id, title, url, description } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const usefulLink = await db.usefulLink.update({
      where: { id },
      data: { title, url, description },
    });

    return NextResponse.json(usefulLink);
  } catch (error) {
    console.log("[USEFUL LINK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const { id } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.usefulLink.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[USEFUL LINK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
