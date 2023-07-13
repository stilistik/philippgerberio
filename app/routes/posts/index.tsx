import { Post } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <ThumbnailGrid>
      {posts.length === 0 && <h3>No blog posts yet</h3>}
      {posts.map((post) => {
        return (
          <Link to={`/posts/${post.slug}`} key={post.id}>
            <ContentThumbnail content={post} />
          </Link>
        );
      })}
    </ThumbnailGrid>
  );
}
