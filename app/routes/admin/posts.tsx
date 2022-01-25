import { Outlet } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

export default function AdminBlogIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
