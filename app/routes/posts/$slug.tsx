import { Post } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { ContentDisplay } from "~/components/content/ContentDisplay";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) {
    return badRequest({ slug: params.slug, error: "Post not found" });
  }
  return post;
};

export default function Post() {
  const post = useLoaderData<Post>();
  return <ContentDisplay content={post} />;
}
