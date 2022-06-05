import { Outlet } from "@remix-run/react";
import { PageLayout } from "~/components/main/PageLayout";

export default function BlogIndex() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
