import { redirect } from "remix";

export const loader = () => {
  return redirect("/admin/projects");
};
