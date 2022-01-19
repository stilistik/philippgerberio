import clx from "classnames";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clx("border rounded-xl p-3 focus:outline-gray-600", className)}
    />
  );
}
