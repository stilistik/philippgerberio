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
  const variantClass =
    variant === "round" ? "button-grow-center" : "button-grow-left";

  let sizeClass = "";
  if (size === "large") {
    sizeClass = "button-large";
  } else if (size === "small") {
    sizeClass = "button-small";
  } else {
    sizeClass = "button-default";
  }

  return (
    <button
      {...rest}
      className={clx(
        "relative overflow-hidden border-4 border-gray-600 shadow-2xl transition-all bezier duration-300 font-black z-0 bg-gray-600 text-white hover:text-gray-600 after:w-[120%] after:h-[120%] after:rounded-full after:absolute after:-top-[10%] after:-left-[10%] after:bg-white  after:transition-all after:duration-500 after:bezier after:-z-10",
        variantClass,
        sizeClass,
        className
      )}
    >
      {children}
    </button>
  );
}
