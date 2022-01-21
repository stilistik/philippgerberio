import clx from "classnames";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function IconButton({ className, children, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      className={clx("text-gray-400 hover:text-gray-600 py-1.5", className)}
    >
      {children}
    </button>
  );
}
