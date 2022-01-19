import clx from "classnames";
import React from "react";

interface MainHeaderProps
  extends React.HtmlHTMLAttributes<HTMLHeadingElement> {}

export const MainHeader: React.FC<MainHeaderProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <h1
      className={clx("font-medium text-6xl text-gray-600  mb-6", className)}
      {...rest}
    >
      {children}
    </h1>
  );
};
