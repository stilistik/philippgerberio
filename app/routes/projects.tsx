import { Outlet } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

export default function ProjectsIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
