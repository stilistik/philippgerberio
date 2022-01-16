import { Post } from "@prisma/client";
import { Link, useLoaderData } from "remix";
import { getPosts } from "~/post";

export function loader() {
  return getPosts();
}

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return (
    <div className="container mx-auto px-10 py-20">
      <Link to="/posts">Posts</Link>
    </div>
  );
}
