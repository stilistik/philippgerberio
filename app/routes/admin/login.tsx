import { Form } from "remix";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

export default function Login() {
  return (
    <div className="w-full flex justify-center pt-20">
      <Form method="post" className="flex flex-col gap-5 w-96">
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
