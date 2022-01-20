import { Resource } from "@prisma/client";
import { DeleteIcon } from "~/icons/Delete";
import { LinksIcon } from "~/icons/LinksIcon";
import { MarkdownIcon } from "~/icons/Markdown";
import { Button } from "./Button";

function getMd(resource: Resource): string {
  if (resource.mimetype.includes("image")) {
    return `![img](${resource.url})`;
  }
  return "";
}

interface ResourceElementProps {
  resource: Resource;
}

const ResourceElement = ({ resource }: ResourceElementProps) => {
  function copyUrl() {
    navigator.clipboard.writeText(resource.url);
  }

  function copyMd() {
    navigator.clipboard.writeText(getMd(resource));
  }

  return (
    <div className="flex mb-2">
      <div
        className="border rounded-md mr-5"
        style={{
          width: 80,
          height: 80,
          backgroundImage: `url(${resource.url})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      />

      <div>
        <p>{resource.name}</p>
        <div className="flex gap-3 mt-2">
          <Button size="tiny" onClick={copyUrl}>
            <LinksIcon />
          </Button>
          <Button size="tiny" onClick={copyMd}>
            <MarkdownIcon />
          </Button>
          <form action="/api/delete" method="post">
            <input type="hidden" name="id" value={resource.id} />
            <Button size="tiny" type="submit">
              <DeleteIcon />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ResourceBrowserProps {
  resources: Resource[];
}

export const ResourceBrowser = ({ resources }: ResourceBrowserProps) => {
  return (
    <div className="w-full h-full p-5">
      {resources.map((resource) => {
        return <ResourceElement key={resource.id} resource={resource} />;
      })}
    </div>
  );
};
