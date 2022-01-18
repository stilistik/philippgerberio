import clx from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "round" | "default";
  size?: "large" | "default" | "small";
}

export function Button({
  className,
  children,
  variant = "default",
  size = "default",
  ...rest
}: ButtonProps) {
  const variantClasses =
    variant === "round"
      ? "after:origin-center after:scale-0 hover:after:scale-100"
      : "after:origin-left after:scale-x-0 hover:after:scale-x-100";

  let sizeClasses = "";
  if (size === "large") {
    sizeClasses = "text-2xl px-6 py-4";
  } else if (size === "small") {
    sizeClasses = "text-xl px-4 py-1.5";
  } else {
    sizeClasses = "text-xl px-6 py-4";
  }

  return (
    <button
      {...rest}
      className={clx(
        "relative overflow-hidden border-4 border-gray-600 rounded-2xl shadow-2xl transition-all bezier duration-300 font-black z-0 bg-gray-600 text-white hover:text-gray-600 after:w-[120%] after:h-[120%] after:rounded-full after:absolute after:-top-[10%] after:-left-[10%] after:bg-white  after:transition-all after:duration-500 after:bezier after:-z-10",
        variantClasses,
        sizeClasses,
        className
      )}
    >
      {children}
    </button>
  );
}
