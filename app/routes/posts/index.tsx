import { Post } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { PostElement } from "~/components/elements/PostElement";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.post.findMany({ where: { published: true } });
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {posts.map((post) => {
        return (
          <Link to={`/posts/${post.slug}`} key={post.id}>
            <PostElement post={post} />
          </Link>
        );
      })}
    </div>
  );
}
