import { Post, Project } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { parsemd } from "~/utils/md.server";

interface LoaderData {
  post: Post;
  html: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "expected params.id");
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return badRequest({ id: params.id, error: "Post not found" });
  }
  const html = parsemd(post.fullText || "");
  return { post, html };
};

export default function Project() {
  const { post, html } = useLoaderData<LoaderData>();
  return (
    <>
      <header>
        <h1>{post.title}</h1>
        <h3>{post.description}</h3>
        <img src={post.thumbnail || ""} />
      </header>
      <main dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
