import React from "react";
import clx from "classnames";
import { CheckIcon } from "~/icons/Check";

interface CheckboxProps
  extends React.HtmlHTMLAttributes<HTMLInputElement>,
    React.HTMLProps<HTMLInputElement> {
  label: string;
}

export const Checkbox = ({ className, label, id, ...rest }: CheckboxProps) => {
  return (
    <div className="inline-block">
      <label className="checkbox-root" htmlFor={id}>
        <input type="checkbox" id={id} {...rest} />
        <div role="button" className="checkbox">
          <CheckIcon />
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
};
