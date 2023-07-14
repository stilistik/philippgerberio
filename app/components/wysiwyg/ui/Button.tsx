import { ReactNode } from "react";
import clx from "classnames";

export default function Button({
  "data-test-id": dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: {
  "data-test-id"?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={clx("py-3 px-5 ", className)}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { "data-test-id": dataTestId })}
    >
      {children}
    </button>
  );
}
