import { LoaderFunction, Outlet, useLoaderData } from "remix";
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

  return <Outlet />;
}
