import { Project } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.project.findMany();
};

export default function Projects() {
  const projects = useLoaderData<Project[]>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        return (
          <Link to={`/projects/${project.slug}`} key={project.id}>
            <div
              className="h-80 bg-gray-200 rounded-2xl shadow-2xl flex items-center justify-center text-white font-black text-2xl"
              style={{
                backgroundImage:
                  "url(https://www.littleleloo.com/wp-content/uploads/Colorful-Abstract-Painting-Against-All-Odds-1-960x720.jpg.webp)",
                backgroundSize: "cover",
              }}
            >
              {project.title}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
