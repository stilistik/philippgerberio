import clx from "classnames";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function IconButton({ className, children, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      className={clx(
        "relative text-gray-400 hover:text-gray py-1.5",
        className
      )}
    >
      {children}
    </button>
  );
}
