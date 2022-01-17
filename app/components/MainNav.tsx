import { Link, useLocation } from "remix";
import clx from "classnames";
import React from "react";

interface NavLinkProps {
  to: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const [hovered, setHovered] = React.useState(false);
  const location = useLocation();

  const showUnderline = hovered || location.pathname.includes(to);

  return (
    <Link
      to={to}
      className="relative font-bold text-2xl text-gray-600 pb-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        className={clx(
          "absolute bottom-0 left-0 border-b-4 w-full transform border-gray-600 transition-all origin-left ease-in-out duration-300",
          {
            "scale-x-100": showUnderline,
            "scale-x-0": !showUnderline,
          }
        )}
      />
    </Link>
  );
};

export const MainNav = () => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div className="flex items-center gap-10">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative font-medium text-4xl rounded-full border-4 border-gray-600 hover:text-gray-600 flex pt-2 justify-center bg-gray-600 text-white cursor-pointer"
        style={{ width: 70, height: 70 }}
      >
        <span
          className={clx(
            "absolute top-0 left-0 bg-white rounded-full w-full h-full transform duration-300 ease-in-out",
            { "scale-0": !hovered, "scale-1": hovered }
          )}
        />
        <span
          className={clx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out -mt-1",
            {
              "text-gray-600": hovered,
              "text-white": !hovered,
            }
          )}
        >
          pg
        </span>
      </div>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/posts">Blog</NavLink>
      <NavLink to="/about">About</NavLink>
    </div>
  );
};
