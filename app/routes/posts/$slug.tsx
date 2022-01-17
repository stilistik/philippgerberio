import { Post } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return db.post.findUnique({ where: { slug: params.slug } });
};

export default function Post() {
  const post = useLoaderData<Post>();
  return (
    <PageLayout>
      <h1 className="font-black text-6xl text-red-400">{post.title}</h1>
      <h3 className="font-black text-2xl text-gray-400">{post.description}</h3>
      <article>{post.fullText}</article>
    </PageLayout>
  );
}
