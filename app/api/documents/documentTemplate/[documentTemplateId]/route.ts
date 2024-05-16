import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/isAdminCheck";
import { getServerSessionFunc } from "../../../auth/_components/getSessionFunction";

// get by id

export async function GET(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const documentTemplate =
      await db.documentTemplate.findUnique({
        where: {
          id: params.documentTemplateId as string,
        },
        include: {
          templateBlocks: true, // Incluye los bloques de plantilla asociados
        },
      });

    return NextResponse.json(documentTemplate);
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}

// update
export async function PUT(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();
    const { title, description, category, templateBlocks } =
      await req.json();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Actualiza la información principal del template
    const documentTemplate = await db.documentTemplate.update({
      where: {
        id: params.documentTemplateId as string,
      },
      data: {
        title,
        description,
        category,
      },
    });

    // Obtener los bloques existentes para el template actual
    const existingBlocks = await db.templateBlock.findMany({
      where: { documentTemplateId: documentTemplate.id },
    });

    console.log("existingBlocks: ", existingBlocks);

    // Crear un mapa de los bloques existentes por ID para un acceso más rápido
    const existingBlockMap = new Map(
      existingBlocks.map(block => [block.id, block])
    );

    console.log("existingBlockMap: ", existingBlockMap);

    // Promesas de actualización y creación
    const promises = templateBlocks.map(async (block: any) => {
      const { id, content, variablesIds } = block;

      console.log("block: ", block);
      if (id && existingBlockMap.has(id)) {
        console.log("Updating block: ", id);
        // Actualizar bloque existente
        return db.templateBlock.update({
          where: { id },
          data: {
            content,
            variables: {
              set:
                variablesIds.length > 0
                  ? variablesIds.map((id: string) => ({ id }))
                  : [],
            },
          },
        });
      } else {
        console.log("Creating block: ", id);
        // Crear nuevo bloque
        return db.templateBlock.create({
          data: {
            content,
            documentTemplateId: documentTemplate.id,
            variables: {
              connect:
                variablesIds.length > 0
                  ? variablesIds.map((id: string) => ({ id }))
                  : [],
            },
          },
        });
      }
    });

    await Promise.all(promises);

    return NextResponse.json({
      documentTemplate,
      templateBlocks,
    });
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// delete
export async function DELETE(
  req: Request,
  { params }: { params: { documentTemplateId: string } }
) {
  try {
    const { userId, role } = await getServerSessionFunc();

    if (!userId || !isAdmin(role)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    await db.documentTemplate.delete({
      where: {
        id: params.documentTemplateId as string,
      },
    });

    return new NextResponse("Deleted", {
      status: 200,
    });
  } catch (error) {
    console.log("[DOCUMENT TEMPLATE]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
