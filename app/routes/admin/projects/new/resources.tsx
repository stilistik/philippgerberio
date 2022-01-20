import { Resource } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { ResourceBrowser } from "~/components/interaction/ResourceBrowser";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = () => {
  return db.resource.findMany();
};

export default function Resources() {
  const resources = useLoaderData<Resource[]>();
  return (
    <div className="fixed top-0 right-0 bg-white shadow-2xl h-screen">
      <ResourceBrowser resources={resources} />;
    </div>
  );
}
