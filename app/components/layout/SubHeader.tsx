import clx from "classnames";
import React from "react";

interface SubHeaderProps extends React.HtmlHTMLAttributes<HTMLHeadingElement> {}

export const SubHeader: React.FC<SubHeaderProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <h3 className={clx("subheader", className)} {...rest}>
      {children}
    </h3>
  );
};
