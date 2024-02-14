import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import * as bcrypt from "bcryptjs";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();
    const { name, email, role, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    console.log("POST", { name, email, role, password });

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", {
        status: 400,
      });
    }

    console.log("POST", { name, email, role, hashedPassword });

    const user = await db.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[CATEGORY]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

// get users
export async function GET(req: Request) {
  try {
    const { userId } = await getServerSessionFunc();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const users = await db.user.findMany();

    return NextResponse.json(users);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
