import React from "react";
import clx from "classnames";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function (
  props,
  ref
) {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={clx("border rounded-xl p-3 focus:outline-gray-600", className)}
    />
  );
});
