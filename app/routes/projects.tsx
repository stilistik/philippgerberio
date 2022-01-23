import { Outlet, redirect } from "remix";
import { PageLayout } from "~/components/main/PageLayout";

export default function AdminIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
