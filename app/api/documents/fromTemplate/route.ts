// app/api/documents/fromTemplate/route.ts

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../../auth/_components/getSessionFunction";

export async function POST(req: Request) {
  const { userId, role } = await getServerSessionFunc();

  if (!userId || !isAdmin(role)) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }
  const { template, variables, propertyId } = await req.json();

  // variables is an array of objects with key value pairs variable: "{name}", value: "rodri"
  // content is html content

  // Función para reemplazar las variables en el contenido
  function replaceVariablesInContent(
    content: string,
    variables: { variable: string; value: string }[]
  ) {
    // Crea un nuevo string a partir del contenido original
    let updatedContent = content;

    // Itera sobre el array de variables
    variables.forEach(
      ({
        variable,
        value,
      }: {
        variable: string;
        value: string;
      }) => {
        // Crea una expresión regular para encontrar la variable en el contenido
        // y asegúrate de escapar los caracteres especiales si es necesario.
        const variableRegex = new RegExp(
          escapeRegExp(variable),
          "g"
        );

        // Reemplaza todas las instancias de la variable en el contenido
        updatedContent = updatedContent.replace(
          variableRegex,
          value
        );
      }
    );

    return updatedContent;
  }

  // Función auxiliar para escapar caracteres especiales en las variables para regex
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& significa la cadena completa que coincide con el patrón
  }

  const finalContent = replaceVariablesInContent(
    template.content,
    variables
  );

  console.log("finalContent", finalContent);

  const document = await db.document.create({
    data: {
      title: template.title,
      content: finalContent,
      description: template.description,
      category: template.category,
      propertyId: propertyId,
      createdBy: userId,
    },
  });

  return NextResponse.json({ document });

  // return NextResponse.json({ finalContent });
}
