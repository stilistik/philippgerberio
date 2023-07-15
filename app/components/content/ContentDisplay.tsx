import { Post, Project } from "@prisma/client";

interface ContentDisplayProps {
  content: Post | Project;
}

export const ContentDisplay = ({ content }: ContentDisplayProps) => {
  return (
    <>
      <header>
        <h1>{content.title}</h1>
        <h3>{content.description}</h3>
        <div
          className="col-span-full h-[300px] md:h-[600px] bg-cover bg-center rounded-lg shadow-lg"
          style={{ backgroundImage: `url(${content.thumbnail})` }}
        />
      </header>
      <main dangerouslySetInnerHTML={{ __html: content.fullText ?? "" }} />
    </>
  );
};
