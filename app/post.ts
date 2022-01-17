import { Post, PrismaClient } from "@prisma/client";

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

export async function createPost(postData: any) {
  await client.$connect();
  const post = client.post.create({ data: postData });
  client.$disconnect();
  return post;
}
