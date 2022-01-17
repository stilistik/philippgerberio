import { Post } from "@prisma/client";
import { Link, useLoaderData } from "remix";
import { PageLayout } from "~/components/PageLayout";
import { getPosts } from "~/post";

export default function Index() {
  return (
    <PageLayout>
      <h1 className="text-6xl font-black">WELCOME</h1>
    </PageLayout>
  );
}
