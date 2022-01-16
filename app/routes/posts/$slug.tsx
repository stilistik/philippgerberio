import { Post } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function Post() {
  const post = useLoaderData<Post>();
  return (
    <div className="container mx-auto">
      <h1>{post.title}</h1>
      <div>{post.description}</div>
      <div>{post.fullText}</div>
    </div>
  );
}
