import { Post, User } from "@prisma/client";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db.server";
import { getUser, requireLoggedInUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request);
  const hasUser = Boolean(userId);
  const posts = await db.post.findMany();
  return { hasUser, posts };
};

interface LoaderData {
  posts: Post[];
  hasUser: boolean;
}

export default function Admin() {
  const { posts, hasUser } = useLoaderData<LoaderData>();

  return (
    <PageLayout showLogout={hasUser}>
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
