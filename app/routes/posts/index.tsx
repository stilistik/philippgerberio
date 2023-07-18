import { Post, Resource } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
import { db } from "~/utils/db.server";

interface PostWithFrontImage extends Post {
  frontImage: Resource;
}

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    posts.map(async (p) => {
      let frontImage = null;
      if (p?.thumbnail) {
        frontImage = await db.resource.findFirst({
          where: { url: p.thumbnail },
        });
      }
      return { ...p, frontImage };
    })
  );
};

export default function Posts() {
  const posts = useLoaderData<PostWithFrontImage[]>();

  return (
    <ThumbnailGrid>
      {posts.length === 0 && <h3>No blog posts yet</h3>}
      {posts.map((post) => {
        return (
          <Link to={`/posts/${post.slug}`} key={post.id}>
            <ContentThumbnail content={post} frontImage={post.frontImage} />
          </Link>
        );
      })}
    </ThumbnailGrid>
  );
}
