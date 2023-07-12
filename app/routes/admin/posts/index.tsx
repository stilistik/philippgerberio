import { Post } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { Button } from "~/components/interaction/Button";
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
      <div className="mb-10">
        <Form method="post">
          <Button type="submit">New Post</Button>
        </Form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <Link to={post.id} key={post.id}>
            <ContentThumbnail content={post} />
          </Link>
        ))}
      </div>
    </>
  );
}
