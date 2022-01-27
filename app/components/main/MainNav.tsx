import { Link, useLocation } from "remix";
import clx from "classnames";
import React from "react";
import { Button } from "../interaction/Button";

interface NavLinkProps {
  to: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const [hovered, setHovered] = React.useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.includes("admin");
  const showUnderline = hovered || location.pathname.includes(to);

  return (
    <Link
      to={isAdmin ? `/admin${to}` : to}
      className="relative font-bold text-2xl text-main pb-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isAdmin ? "Admin:" : ""}
      {children}
      <span
        className={clx(
          "absolute bottom-0 left-0 border-b-4 w-full transform rounded-full border-gray-600 transition-all origin-left ease-in-out duration-300",
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
    <div className="w-screen flex justify-between items-center container mx-auto lg:px-60 py-5 lg:py-20">
      <div className="flex items-center gap-10">
        <Link to="/" className="mr-10">
          <Button
            variant="round"
            className="text-4xl font-medium"
            style={{ width: 70, height: 70 }}
          >
            <span className="-mt-2">pg</span>
          </Button>
        </Link>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/posts">Blog</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      {showLogout && (
        <form action="/logout" method="post">
          <Button type="submit" size="small" className="-mt-1">
            Logout
          </Button>
        </form>
      )}
    </div>
  );
};
