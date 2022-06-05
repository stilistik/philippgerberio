import { Post } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return db.post.findUnique({ where: { slug: params.slug } });
};

export default function Post() {
  const post = useLoaderData<Post>();
  return (
    <>
      <h1 className="font-black text-6xl text-red-400">{post.title}</h1>
      <h3 className="font-black text-2xl text-gray-400">{post.description}</h3>
      <article>{post.fullText}</article>
    </>
  );
}
