import { Outlet } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

export default function BlogIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
