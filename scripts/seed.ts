import { db } from "@/lib/db";
import * as bcrypt from "bcryptjs";

async function main() {
  const email = "mail@mail.com";
  const password = "12345";

  const existingUser = await db.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    console.log(`El usuario con email ${email} ya existe.`);
    return;
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el usuario
  const user = await db.user.create({
    data: {
      name: "Usuario seed",
      email,
      role: "ADMIN",
      password: hashedPassword,
      // agentId: "ID_DEL_AGENTE",
    },
  });

  console.log("Usuario creado exitosamente:", user);
}

main()
  .catch(e => {
    console.error("Error al crear el usuario:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
