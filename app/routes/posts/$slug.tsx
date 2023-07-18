import { Post, Resource } from "@prisma/client";
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

  let frontImage = null;
  if (post?.thumbnail) {
    frontImage = await db.resource.findFirst({
      where: { url: post.thumbnail },
    });
  }
  return { post, frontImage };
};

export default function Post() {
  const { post, frontImage } = useLoaderData<{
    post: Post;
    frontImage: Resource;
  }>();
  return <ContentDisplay content={post} frontImage={frontImage} />;
}
