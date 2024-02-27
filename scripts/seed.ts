const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [{ name: "General" }],
    });

    await database.user.create({
      data: {
        email: "test@testuser.com",
        name: "Test",
        password: "12345",
        role: "ADMIN",
      },
    });
    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database: ", error);
  } finally {
    await database.$disconnect();
  }
}

main();
