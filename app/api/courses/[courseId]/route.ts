import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";
import { MinioStorageProvider } from "@/services/storage/implementations/minio";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerSessionFunc();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerSessionFunc();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (existingCourse) {
      if (
        existingCourse.imageUrl &&
        existingCourse.imageUrl !== values.imageUrl
      ) {
        const storageProvider = new MinioStorageProvider();

        let path = existingCourse.imageUrl.split("/").pop();

        if (path) {
          path = path.replace(/%20/g, " ");
          path = path.replace(/%28/g, "(");
          path = path.replace(/%29/g, ")");

          console.log("Deleting image:", path);
          await storageProvider.delete(path);
        }
      }
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
