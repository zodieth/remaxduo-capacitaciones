import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/teacher";
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
    const { userId, role } = await getServerSessionFunc();
    // @ts-ignore
    const url = req.nextUrl;
    const id = url.pathname.split("/").pop();

    if (!userId || !isAdmin(role)) {
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
    const { userId, role: userRole } =
      await getServerSessionFunc();

    // @ts-ignore
    const url = req.nextUrl;
    const id = url.pathname.split("/").pop();

    const { name, email, role, password } = await req.json();

    if (!userId || !isAdmin(userRole)) {
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
      console.log("entro a password");
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
    const { userId, role: userRole } =
      await getServerSessionFunc();

    // @ts-ignore
    const url = req.nextUrl;
    // Asumiendo una estructura de URL como /api/resource/[id]
    const id = url.pathname.split("/").pop();

    if (!userId || !isAdmin(userRole)) {
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
