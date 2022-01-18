import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import styles from "./tailwind.css";
import highlights from "highlight.js/styles/rainbow.css";
import { PageLayout } from "./components/main/PageLayout";
import { getUserId } from "./utils/session.server";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: highlights },
  ];
}

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const hasUser = Boolean(userId);
  return hasUser;
};

export default function App() {
  const hasUser = useLoaderData<boolean>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PageLayout showLogout={hasUser}>
          <Outlet />
        </PageLayout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
