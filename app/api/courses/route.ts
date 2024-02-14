import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/teacher";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const { userId, role } = await getServerSessionFunc();
    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
