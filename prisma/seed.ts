import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import invariant from "tiny-invariant";

const client = new PrismaClient();

const { ROOT_USER_PASSWORD } = process.env;

async function seed() {
  invariant(
    ROOT_USER_PASSWORD,
    "Seed: Root user password must be defined in .env"
  );

  await client.user.create({
    data: {
      firstName: "Philipp",
      lastName: "Gerber",
      username: "philippgerber",
      passwordHash: await bcryptjs.hash(ROOT_USER_PASSWORD, 10),
    },
  });
}

seed();
