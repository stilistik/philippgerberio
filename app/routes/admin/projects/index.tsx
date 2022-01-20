import { Project } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { ProjectElement } from "~/components/elements/ProjectElement";
import { Button } from "~/components/interaction/Button";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const project = await db.project.create({ data: { authorId: userId } });
  return redirect("/admin/projects/" + project.id);
};

export const loader: LoaderFunction = async () => {
  return db.project.findMany();
};

export default function Projects() {
  const projects = useLoaderData<Project[]>();
  return (
    <>
      <p className="my-10">
        <Form method="post">
          <Button type="submit">New Project</Button>
        </Form>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <Link to={project.id} key={project.id}>
            <ProjectElement project={project}>
              <form action="/admin/projects/delete" method="post">
                <input type="hidden" name="id" value={project.id} />
                <Button
                  type="submit"
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  className="my-5"
                >
                  Delete
                </Button>
              </form>
            </ProjectElement>
          </Link>
        ))}
      </div>
    </>
  );
}
