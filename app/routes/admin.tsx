import { LoaderFunction, Outlet } from "remix";
import { requireLoggedInUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return requireLoggedInUser(request);
};

export default function Admin() {
  return <Outlet />;
}
