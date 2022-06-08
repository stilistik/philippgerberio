import { Post } from "@prisma/client";
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
  invariant(params.slug, "expected params.slug");
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) {
    return badRequest({ slug: params.slug, error: "Post not found" });
  }
  const html = parsemd(post.fullText || "");
  return { post, html };
};

export default function Post() {
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
