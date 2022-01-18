import { Post } from "@prisma/client";
import { Link, useLoaderData } from "remix";
import { Button } from "~/components/interaction/Button";
import { PageLayout } from "~/components/main/PageLayout";
import { db } from "~/utils/db.server";

export function loader() {
  return db.post.findMany();
}

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return (
    <PageLayout>
      <p>
        <Link to="newpost">
          <Button>New Post</Button>
        </Link>
      </p>
      <h1>Posts</h1>
      {posts.map((post) => {
        return (
          <div key={post.id} className="my-10">
            <h1 className="font-black text-6xl text-red-400">{post.title}</h1>
            <h3 className="font-black text-2xl text-gray-400">
              {post.description}
            </h3>
            <Link to={post.slug}>read more</Link>
          </div>
        );
      })}
    </PageLayout>
  );
}