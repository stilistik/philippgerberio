import clx from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clx("p-10 border rounded-xl shadow-2xl", className)}
    />
  );
}
