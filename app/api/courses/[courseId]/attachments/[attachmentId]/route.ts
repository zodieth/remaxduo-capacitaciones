import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = await getServerSessionFunc();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
