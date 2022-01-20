import clx from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "round" | "default";
  size?: "large" | "default" | "small" | "tiny";
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
  } else if (size === "tiny") {
    sizeClass = "button-tiny";
  } else {
    sizeClass = "button-default";
  }

  return (
    <button
      {...rest}
      className={clx("button-base", variantClass, sizeClass, className)}
    >
      {children}
    </button>
  );
}
