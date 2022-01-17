import { Post } from "@prisma/client";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db";
import { requireUserId } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request, "/admin");
  return db.post.findMany();
};

export default function Admin() {
  const posts = useLoaderData<Post[]>();
  return (
    <PageLayout>
      <nav>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </PageLayout>
  );
}
