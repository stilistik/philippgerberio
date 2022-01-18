import { Link, redirect } from "remix";
import { Button } from "~/components/interaction/Button";

export const loader = () => {
  return redirect("/admin/projects");
};

export default function AdminIndex() {
  return (
    <div className="flex gap-10">
      <p>
        <Link to="newpost">
          <Button>New Post</Button>
        </Link>
      </p>
      <p>
        <Link to="newproject">
          <Button>New Project</Button>
        </Link>
      </p>
    </div>
  );
}
