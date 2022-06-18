import { Post, Project } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { ContentDisplay } from "~/components/content/ContentDisplay";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "expected params.id");
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return badRequest({ id: params.id, error: "Post not found" });
  }
  return post;
};

export default function Project() {
  const post = useLoaderData<Post>();
  return <ContentDisplay content={post} />;
}
