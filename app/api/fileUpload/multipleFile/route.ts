import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";
import { isAdmin } from "@/lib/isAdminCheck";
import { writeFile } from "fs/promises";

// ESTE ENDPOINT ESTA DEPRECADO DESDE QUE USAMOS S3-MIN.IO
// usamos una action para subirlo directamente. Ver: app/actions/upload-files.ts

// este endpoint es para subir multiples archivos a la carpeta public/FilesUploaded
export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const data = await request.formData();

    const files: File[] = data.getAll(
      "files"
    ) as unknown as File[];
    const endpoint = data.get("endpoint") as string | undefined;
    const courseId = data.get("courseId") as string | undefined;
    const chapterId = data.get("chapterId") as
      | string
      | undefined;

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files uploaded",
      });
    }
    // let folder = "public/FilesUploaded";
    // if (endpoint === "chapterVideo" && courseId && chapterId) {
    //   folder = `public/FilesUploaded/${courseId}/chapters/${chapterId}`;
    // }

    // if (endpoint && courseId && !chapterId) {
    //   folder = `public/FilesUploaded/${courseId}/${endpoint}`;
    // }

    let folder = "public";

    switch (endpoint) {
      case "chapterVideo":
        if (!courseId || !chapterId) {
          return NextResponse.json({
            success: false,
            message: "Missing courseId or chapterId",
          });
        } else {
          folder = `public/FilesUploaded/${courseId}/chapters/${chapterId}`;
        }
        break;
      case "courseImage":
      case "courseVideo":
        if (!courseId) {
          return NextResponse.json({
            success: false,
            message: "Missing courseId",
          });
        } else {
          folder = `public/FilesUploaded/${courseId}/${endpoint}`;
        }
        break;
      case "templateDocs":
        folder = `public/TemplateDocs`;
      default:
        break;
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const uploadedFilesInfo = await Promise.all(
      files.map(async file => {
        const filePath = path.join(folder, file.name);

        // Verifica si el archivo ya existe
        if (fs.existsSync(filePath)) {
          console.log("YA EXISTE");
          return NextResponse.json({
            success: false,
            message: "File already exists",
          });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(filePath, buffer);

        const urlPath = `/${filePath.replace("public/", "")}`;

        return {
          name: file.name,
          url: urlPath,
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: uploadedFilesInfo,
    });
  } catch (error) {
    console.error("[FILE UPLOAD]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
