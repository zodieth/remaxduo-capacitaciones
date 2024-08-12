import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getServerSessionFunc } from "@/app/api/auth/_components/getSessionFunction";
import { MinioStorageProvider } from "@/services/storage/implementations/minio";

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

    const attachment = await db.attachment.findUnique({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    if (attachment) {
      if (attachment.url) {
        const storageProvider = new MinioStorageProvider();

        let path = attachment.url.split("/").pop();
        if (path) {
          path = path.replace(/%20/g, " ");
          path = path.replace(/%28/g, "(");
          path = path.replace(/%29/g, ")");
          path = path.replace(/%5B/g, "[");
          path = path.replace(/%5D/g, "]");

          console.log("Deleting file from bucket:", path);
          await storageProvider.delete(path);
        }
      }
    }

    const deletedAttachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
