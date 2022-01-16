import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function getPosts() {
  await client.$connect();
  const posts = await client.post.findMany();
  client.$disconnect();
  return posts;
}

export async function getPost(slug: string) {
  await client.$connect();
  const post = await client.post.findUnique({ where: { slug } });
  client.$disconnect();
  return post;
}
