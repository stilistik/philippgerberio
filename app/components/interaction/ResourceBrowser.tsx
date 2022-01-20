import { Resource } from "@prisma/client";
import { Form } from "remix";
import { CodeIcon } from "~/icons/Code";
import { DeleteIcon } from "~/icons/Delete";
import { LinksIcon } from "~/icons/Links";
import { Button } from "./Button";

function getMd(resource: Resource): string {
  if (resource.mimetype.includes("image")) {
    return `![img](${resource.url})`;
  } else if (resource.mimetype.includes("video")) {
    return `<video autoplay controls><source src="${resource.url}" type="${resource.mimetype}"></video>`;
  }
  return "";
}

interface ResourceDisplayProps {
  resource: Resource;
}

const VideoResourceDisplay = ({ resource }: ResourceDisplayProps) => {
  return (
    <video width={80} height={80} autoPlay className="border rounded-md mr-5">
      <source src={resource.url} />
    </video>
  );
};

const ImageResourceDisplay = ({ resource }: ResourceDisplayProps) => {
  return (
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
  );
};

const ResourceDisplay = ({ resource }: ResourceDisplayProps) => {
  if (resource.mimetype.includes("image")) {
    return <ImageResourceDisplay resource={resource} />;
  } else {
    return <VideoResourceDisplay resource={resource} />;
  }
};

interface ResourceElementProps {
  resource: Resource;
  onDelete: (e: any) => void;
}

const ResourceElement = ({ resource, onDelete }: ResourceElementProps) => {
  function copyUrl() {
    navigator.clipboard.writeText(resource.url);
  }

  function copyMd() {
    navigator.clipboard.writeText(getMd(resource));
  }

  return (
    <div className="flex mb-2">
      <ResourceDisplay resource={resource} />
      <div>
        <p>{resource.name}</p>
        <div className="flex gap-3 mt-2">
          <Button size="tiny" onClick={copyUrl}>
            <LinksIcon />
          </Button>
          <Button size="tiny" onClick={copyMd}>
            <CodeIcon />
          </Button>
          <Form method="delete" onChange={onDelete}>
            <input type="hidden" name="id" value={resource.id} />
            <Button size="tiny" type="submit">
              <DeleteIcon />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

interface ResourceBrowserProps {
  resources: Resource[];
  onDelete: (e: any) => void;
}

export const ResourceBrowser = ({
  resources,
  onDelete,
}: ResourceBrowserProps) => {
  return (
    <div className="w-full h-full p-5 overflow-auto">
      {resources.map((resource) => {
        return (
          <ResourceElement
            key={resource.id}
            resource={resource}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
