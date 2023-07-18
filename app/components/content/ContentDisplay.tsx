import { Post, Project, Resource } from "@prisma/client";
import { FrontImage } from "./FrontImage";

interface ContentDisplayProps {
  content: Post | Project;
  frontImage: Resource;
}

export const ContentDisplay = ({
  content,
  frontImage,
}: ContentDisplayProps) => {
  return (
    <>
      <header>
        <h1>{content.title}</h1>
        <h3>{content.description}</h3>
        <FrontImage resource={frontImage} />
      </header>
      <main dangerouslySetInnerHTML={{ __html: content.fullText ?? "" }} />
    </>
  );
};
