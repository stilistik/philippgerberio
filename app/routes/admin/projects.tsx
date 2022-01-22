import { Outlet, redirect } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

// export const loader = () => {
//   return redirect("/admin/projects");
// };

export default function AdminIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
