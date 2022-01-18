import { Link, useLocation } from "remix";
import clx from "classnames";
import React from "react";
import { Button } from "./Button";

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

interface MainNavProps {
  showLogout?: boolean;
}

export const MainNav = ({ showLogout = false }: MainNavProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-10">
        <Link to="/" className="mr-10">
          <Button
            variant="center"
            className="rounded-full text-4xl font-medium flex justify-center pt-2"
            style={{ width: 70, height: 70 }}
          >
            pg
          </Button>
        </Link>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/posts">Blog</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      {showLogout && (
        <form action="/logout" method="post">
          <Button type="submit" className="py-1 px-2 -mt-1">
            Logout
          </Button>
        </form>
      )}
    </div>
  );
};
