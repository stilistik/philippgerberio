import { Post, Project } from "@prisma/client";

interface ContentDisplayProps {
  content: Post | Project;
}

export const ContentDisplay = ({ content }: ContentDisplayProps) => {
  return (
    <>
      <Background />
      <header>
        <h1>{content.title}</h1>
        <h3>{content.description}</h3>
        <img src={content.thumbnail || ""} />
      </header>
      <main dangerouslySetInnerHTML={{ __html: content.fullText ?? "" }} />
    </>
  );
};
