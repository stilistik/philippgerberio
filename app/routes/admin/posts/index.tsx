import { Post } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { Button } from "~/components/interaction/Button";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const post = await db.post.create({ data: { authorId: userId } });
  return redirect("/admin/posts/" + post.id);
};

export const loader: LoaderFunction = async () => {
  return db.post.findMany({ orderBy: { createdAt: "desc" } });
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <>
      <div className="mb-10 ml-8">
        <Form method="post">
          <Button type="submit">New Post</Button>
        </Form>
      </div>
      <ThumbnailGrid>
        {posts.map((post) => (
          <Link to={post.id} key={post.id}>
            <ContentThumbnail content={post} />
          </Link>
        ))}
      </ThumbnailGrid>
    </>
  );
}
