import { Resource } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { Button } from "~/components/interaction/Button";
import { ResourceBrowser } from "~/components/interaction/ResourceBrowser";
import { CloseIcon } from "~/icons/Close";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = () => {
  return db.resource.findMany();
};

export default function Resources() {
  const resources = useLoaderData<Resource[]>();
  return (
    <div className="fixed top-0 right-0 bg-white shadow-2xl h-screen">
      <Link to="../">
        <Button size="small" className="m-2">
          <CloseIcon />
        </Button>
      </Link>
      <ResourceBrowser resources={resources} />;
    </div>
  );
}
