import clx from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "center" | "left";
}

export function Button(props: ButtonProps) {
  const { className, children, variant = "left", ...rest } = props;

  const variantClasses =
    variant === "center"
      ? "after:origin-center after:scale-0 hover:after:scale-100"
      : "after:origin-left after:scale-x-0 hover:after:scale-x-100";

  return (
    <button
      {...rest}
      className={clx(
        "relative overflow-hidden text-xl px-6 py-4 border-4 border-gray-600 rounded-2xl shadow-2xl transition-all bezier duration-300 font-black z-0 bg-gray-600 text-white hover:text-gray-600 after:w-[120%] after:h-[120%] after:rounded-full after:absolute after:-top-[10%] after:-left-[10%] after:bg-white  after:transition-all after:duration-500 after:bezier after:-z-10",
        variantClasses,
        className
      )}
    >
      {children}
    </button>
  );
}
