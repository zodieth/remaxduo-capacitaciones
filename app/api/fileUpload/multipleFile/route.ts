import { isTeacher } from "@/lib/teacher";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";

// este endpoint es para subir multiples archivos a la carpeta public/FilesUploaded
export async function POST(request: NextRequest) {
  try {
    const { userId } = await getServerSessionFunc();

    if (!userId || !isTeacher(userId)) {
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

    let folder = "public/FilesUploaded";

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files uploaded",
      });
    }

    if (endpoint && courseId) {
      folder = `public/FilesUploaded/${courseId}/${endpoint}`;
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const uploadedFilesInfo = await Promise.all(
      files.map(async file => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(folder, file.name);

        await writeFile(filePath, buffer);

        const urlPath = `/${filePath.replace("public/", "")}`;

        return { name: file.name, url: `${urlPath}` };
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
