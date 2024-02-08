import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `FilesUploaded/${file.name}`;

    if (fs.existsSync("FilesUploaded")) {
      console.log("FilesUploaded exists");
    } else {
      fs.mkdirSync("FilesUploaded");
    }

    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[FILE UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
