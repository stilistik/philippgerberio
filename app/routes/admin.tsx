import { Post, User } from "@prisma/client";
import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from "remix";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request);
  const hasUser = Boolean(userId);
  return { hasUser };
};

interface LoaderData {
  hasUser: boolean;
}

export default function Admin() {
  const { hasUser } = useLoaderData<LoaderData>();

  return (
    <PageLayout showLogout={hasUser}>
      <Outlet />
    </PageLayout>
  );
}
