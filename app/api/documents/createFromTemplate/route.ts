// pages/api/route.ts

// app/api/documents/route.ts o el archivo relevante conforme a tu estructura.

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

// Asegúrate de que estás utilizando las interfaces adecuadas si estás en un contexto de Edge Function o Middleware.
export async function POST(req: Request) {
  // ["nombre","dni","cuit-cuil","nombreCalle","numeroCalle","barrio-localidad","partido","email","celular"]
  const {
    nombre,
    dni,
    cuitCuil,
    nombreCalle,
    numeroCalle,
    barrioLocalidad,
    partido,
    email,
    celular,
  } = await req.json();

  // if (!name) {
  //   // Ajusta la respuesta conforme a la API Fetch estándar si es necesario.
  //   return new Response(
  //     JSON.stringify({ error: "Nombre requerido" }),
  //     {
  //       status: 400,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // }

  try {
    const templatePath = path.resolve(
      "./public/TemplateDocs",
      "testingPlanilla.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // get data from docx file
    // const data = doc.getFullText();
    // console.log("data", data);

    // get { values}

    const values = doc.getFullText().match(/{([^}]+)}/g);
    console.log("values", values);

    doc.setData({
      nombre,
      dni,
      cuitCuil,
      nombreCalle,
      numeroCalle,
      barrioLocalidad,
      partido,
      email,
      celular,
    });

    // doc.setData({ name });
    doc.render();

    const buffer: Buffer = doc
      .getZip()
      .generate({ type: "nodebuffer" });

    // Define la ruta donde quieres guardar el archivo generado.
    const outputPath = path.resolve(
      "./public/GeneratedDocs",
      "output.docx"
    );

    // Asegúrate de que el directorio existe o créalo.
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), {
        recursive: true,
      });
    }

    // Guarda el archivo.
    fs.writeFileSync(outputPath, buffer);

    // Ajusta la respuesta conforme a la API Fetch estándar.
    return new Response(
      JSON.stringify({
        message: "Documento generado y guardado con éxito",
        filename: `output.docx`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error procesando el documento:", error);
    return new Response(
      JSON.stringify({
        error: "Error al procesar el documento",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// import { NextApiRequest, NextApiResponse } from "next";
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import fs from "fs";
// import path from "path";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   console.log("req", req);
//   console.log("LLEgo!");
//   const { name } = await req.json();

//   // Asegúrate de que el cuerpo de la solicitud contenga el nombre
//   if (!name) {
//     return NextResponse.json(
//       { error: "Nombre requerido" },
//       { status: 400 }
//     );
//   }

//   try {
//     const templatePath = path.resolve(
//       "./public/TemplateDocs",
//       "Template1.docx"
//     );
//     const content = fs.readFileSync(templatePath, "binary");
//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//     });

//     doc.setData({ name });

//     doc.render();

//     const buffer: Buffer = doc
//       .getZip()
//       .generate({ type: "nodebuffer" });

//     // Establece los encabezados para descargar el documento generado

//     return NextResponse.download(buffer, {
//       filename: `${name}.docx`,
//     });

//     return NextResponse.json({ name });
//   } catch (error) {
//     console.error("Error al obtener propiedades:", error);
//   }
// }
