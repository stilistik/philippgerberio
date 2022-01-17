import { Post } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "remix";
import { PageLayout } from "~/components/PageLayout";
import { getPosts } from "~/post";

export const loader = () => {
  return getPosts();
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
