import {
  ActionFunction,
  Form,
  Links,
  Meta,
  Scripts,
  useSearchParams,
} from "remix";
import { Button } from "~/components/interaction/Button";
import { Input } from "~/components/interaction/Input";
import { badRequest } from "~/utils/routing.server";
import { createUserSession, login } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo");

  const fields = { username, password, redirectTo };

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fields,
      formError: "Form submitted incorrectly.",
    });
  }

  const user = await login({ username, password });

  if (!user) {
    return badRequest({
      fields,
      formError: "Incorrect username or password submitted.",
    });
  }

  return createUserSession(user.id, redirectTo);
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Scripts />
      </body>
    </html>
  );
}

export default function Login() {
  const [searchParams] = useSearchParams();

  return (
    <div className="w-full flex justify-center pt-20">
      <Form method="post" className="flex flex-col gap-5 w-96">
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
        <p>
          <label htmlFor="username">Username</label>
          <Input type="text" id="username" name="username" className="w-full" />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            name="password"
            className="w-full"
          />
        </p>
        <p>
          <Button type="submit" className="w-full py-2 mt-6">
            Login
          </Button>
        </p>
      </Form>
    </div>
  );
}
