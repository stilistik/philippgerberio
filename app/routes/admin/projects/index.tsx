import { Project } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { ProjectElement } from "~/components/elements/ProjectElement";
import { Button } from "~/components/interaction/Button";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.project.findMany();
};

export default function Projects() {
  const projects = useLoaderData<Project[]>();
  return (
    <>
      <p className="my-10">
        <Link to="new">
          <Button>New Project</Button>
        </Link>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <Link to={project.slug} key={project.id}>
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
