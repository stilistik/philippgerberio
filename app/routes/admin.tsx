import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireLoggedInUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return requireLoggedInUser(request);
};

export default function Admin() {
  return <Outlet />;
}
