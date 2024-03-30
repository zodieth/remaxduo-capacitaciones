// create new DocumentTemplate

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { title, description, url, variables } =
      await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    // Serializar el arreglo de variables a una cadena JSON
    const variablesJson = JSON.stringify(variables);

    const template = await db.documentTemplate.create({
      data: {
        title,
        description,
        url,
        variables: variablesJson, // Usar la versión serializada
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const documentTemplates =
      await db.documentTemplate.findMany();

    //   para cada template, parsear el string de variables a un array

    documentTemplates.forEach(template => {
      template.variables = JSON.parse(template.variables);
    });

    return NextResponse.json(documentTemplates);
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

// get by id

export async function GET_BY_ID(req: Request) {
  try {
    const { id } = await req.json();

    const documentTemplate =
      await db.documentTemplate.findUnique({
        where: { id },
      });

    if (!documentTemplate) {
      return new NextResponse("Template not found", {
        status: 404,
      });
    }

    const variablesArray = JSON.parse(
      documentTemplate?.variables
    );

    return NextResponse.json({
      ...documentTemplate,
      variables: variablesArray,
    });
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
