import clx from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clx(
        "border rounded-xl shadow-2xl p-3 focus:outline-gray-600",
        className
      )}
    />
  );
}