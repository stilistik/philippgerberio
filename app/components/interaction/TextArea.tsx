import React from "react";
import clx from "classnames";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function (props, ref) {
    const { className, ...rest } = props;
    return (
      <textarea
        ref={ref}
        {...rest}
        className={clx(
          "border rounded-xl p-3 focus:outline-gray-600",
          className
        )}
      />
    );
  }
);
