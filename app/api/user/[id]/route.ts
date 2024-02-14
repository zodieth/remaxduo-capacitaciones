import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import * as bcrypt from "bcryptjs";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";

type UpdateDataType = {
  name: string;
  email: string;
  role: string;
  password?: string;
};

export async function GET(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if (!id)
      return new NextResponse("Invalid ID", {
        status: 400,
      });

    const user = await db.user.findUnique({
      where: { id: id },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;
    const { name, email, role, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if (!id)
      return new NextResponse("Invalid ID", {
        status: 400,
      });

    let updateData: UpdateDataType = { name, email, role };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await db.user.update({
      where: { id: id },
      data: updateData as any,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if (!id)
      return new NextResponse("Invalid ID", {
        status: 400,
      });

    const user = await db.user.delete({
      where: { id: id },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
