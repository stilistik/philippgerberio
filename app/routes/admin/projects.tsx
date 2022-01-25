import { Outlet } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

export default function AdminProjectsIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
