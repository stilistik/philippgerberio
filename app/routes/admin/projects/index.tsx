import { Project } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { Button } from "~/components/interaction/Button";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.project.findMany();
};

export default function Projects() {
  const projects = useLoaderData<Project[]>();
  return (
    <>
      <p>
        <Link to="newproject">
          <Button>New Project</Button>
        </Link>
      </p>

      <h1>Projects</h1>
      {projects.map((project) => (
        <Link to={`edit/${project.slug}`}>
          <p key={project.id}>{project.title}</p>
        </Link>
      ))}
    </>
  );
}
