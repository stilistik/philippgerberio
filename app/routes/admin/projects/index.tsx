import { Project, Resource } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { Button } from "~/components/interaction/Button";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

interface ProjectWithFrontImage extends Project {
  frontImage: Resource;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const project = await db.project.create({ data: { authorId: userId } });
  return redirect("/admin/projects/" + project.id);
};

export const loader: LoaderFunction = async () => {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return await Promise.all(
    projects.map(async (p) => {
      let frontImage = null;
      if (p?.thumbnail) {
        frontImage = await db.resource.findFirst({
          where: { url: p.thumbnail },
        });
      }
      return { ...p, frontImage };
    })
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Scripts />
      </body>
    </html>
  );
}

export default function Projects() {
  const projects = useLoaderData<ProjectWithFrontImage[]>();
  return (
    <>
      <div className="mb-10 ml-8">
        <Form method="post">
          <Button type="submit">New Project</Button>
        </Form>
      </div>
      <ThumbnailGrid>
        {projects.map((project) => (
          <Link to={project.id} key={project.id}>
            <ContentThumbnail content={project} />
          </Link>
        ))}
      </ThumbnailGrid>
    </>
  );
}
