import { Link, useLocation, useNavigate } from "@remix-run/react";
import clx from "classnames";
import React from "react";
import { Button } from "../interaction/Button";
import { colors } from "~/utils/colors";
import { usePaper } from "~/utils/paper";
import { Blob } from "~/utils/blobs";
import { useIsMobile } from "~/utils/hooks";
import { Point } from "paper";
import { getHeight, getWidth } from "~/utils/math";

interface NavLinkProps {
  to: string;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  onClick,
  className,
  children,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const location = useLocation();

  const showUnderline = hovered || location.pathname.includes(to);

  return (
    <Link
      to={to}
      className={
        "relative font-bold text-xl sm:text-2xl text-main pb-1 " + className
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
      <span
        className={clx(
          "absolute bottom-0 left-0 border-b-4 w-full transform rounded-full border-black transition-all origin-left ease-in-out duration-300",
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
  const [count, setCount] = React.useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");

  function handleClick(e: React.MouseEvent) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCount(0), 500);

    setCount(count + 1);
    if (count >= 3) {
      e.preventDefault();
      navigate("/admin/projects");
    }
  }

  return (
    <>
      <div className="relative w-full overflow-hidden flex justify-between items-center container mx-auto px-8 xl:px-28 py-5 md:py-20 z-10">
        <div className="flex items-center gap-5 sm:gap-10">
          <Link to="/" className="mr-5 sm:mr-10" onClick={handleClick}>
            <Button
              variant="round"
              className="text-4xl font-medium shadow-md flex flex-col"
              style={{ width: 70, height: 70 }}
            >
              <span className="-mt-2">pg</span>
              {isAdmin ? <span className="text-xs">Admin</span> : null}
            </Button>
          </Link>

          <div className="hidden md:flex items-center gap-5 sm:gap-10">
            {isAdmin ? (
              <NavLink to="/admin/projects">Projects</NavLink>
            ) : (
              <NavLink to="/projects">Projects</NavLink>
            )}
            {isAdmin ? (
              <NavLink to="/admin/posts">Blog</NavLink>
            ) : (
              <NavLink to="/posts">Blog</NavLink>
            )}
            {isAdmin ? null : <NavLink to="/music">Music</NavLink>}
            {isAdmin ? null : <NavLink to="/about">About</NavLink>}
          </div>
        </div>

        {showLogout && isAdmin && (
          <form action="/logout" method="post">
            <Button type="submit" size="small" className="-mt-1">
              Logout
            </Button>
          </form>
        )}
      </div>
      <MobileMenu />
    </>
  );
};

const springConstant = 0.8;

function springEffect(
  current: number,
  target: number,
  velocity: number,
  damping: number
) {
  const difference = target - current;
  const acceleration = difference * springConstant;
  velocity += acceleration;
  velocity *= damping;
  current += velocity;

  return [current, velocity];
}

const MobileMenu = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showLinks, setShowLinks] = React.useState(false);
  const { ref, paper } = usePaper({ resolution: "full" });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const stateRef = React.useRef<{ blob: Blob | null; increment: number }>({
    blob: null,
    increment: 0,
  });

  React.useEffect(() => {
    if (menuOpen) {
      setTimeout(() => {
        setShowLinks(true);
      }, 200);
    } else {
      setShowLinks(false);
    }
  }, [menuOpen]);

  React.useEffect(() => {
    if (!isMobile) return;
    const { blob } = stateRef.current;
    if (blob) {
      stateRef.current.increment = menuOpen ? 0.3 : -0.3;
    }
  }, [menuOpen]);

  React.useEffect(() => {
    if (!isMobile || !paper || !buttonRef.current) return;
    paper.activate();

    const maxScale = getHeight() / 35;
    const minScale = 0.001;

    const rect = buttonRef.current.getBoundingClientRect();
    const pos = new Point(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
    const blob = new Blob(pos.x, pos.y, 30, colors[0], colors[9], true);
    blob.amplitude = 20;
    blob.intensity = 0.1;
    blob.changeInterval = 0.1;
    blob.path.shadowBlur = 0;
    blob.path.shadowColor = null;
    blob.path.scaling = new Point(minScale, minScale);

    stateRef.current = { ...stateRef.current, blob };

    let velocity = 1;
    let damping = 0.1;

    paper.view.onFrame = (e: any) => {
      const { increment } = stateRef.current;
      blob.update(e.time);
      blob.path.position = pos;

      // In your update loop
      const [newScale, newVelocity] = springEffect(
        blob.path.scaling.x,
        increment > 0 ? maxScale : minScale,
        velocity,
        damping
      );
      velocity = newVelocity;
      blob.path.scaling.x = newScale;
      blob.path.scaling.y = newScale;

      // Limit the increment to be between 1 and 20
      if (blob.path.scaling.x > maxScale) {
        blob.path.scaling.x = maxScale;
        blob.path.scaling.y = maxScale;
      }
      if (blob.path.scaling.x < minScale) {
        blob.path.scaling.x = minScale;
        blob.path.scaling.y = minScale;
      }
    };
  }, [paper, isMobile]);

  return (
    <>
      <canvas
        ref={ref}
        className="w-screen h-screen absolute top-0 left-0 z-10 pointer-events-none"
      />
      {showLinks && (
        <div className="absolute w-screen h-screen top-0 left-0 z-10 flex flex-col items-center pt-40">
          <NavLink
            to="/projects"
            onClick={() => setMenuOpen(false)}
            className="my-3"
          >
            Projects
          </NavLink>
          <NavLink
            to="/posts"
            onClick={() => setMenuOpen(false)}
            className="my-3"
          >
            Blog
          </NavLink>
          <NavLink
            to="/music"
            onClick={() => setMenuOpen(false)}
            className="my-3"
          >
            Music
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="my-3"
          >
            About
          </NavLink>
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={() => setMenuOpen((o) => !o)}
        className="sm:hidden absolute top-11 right-11 z-10"
      >
        <div
          className="w-6 h-1 bg-black rounded m-1"
          style={{
            transform: menuOpen ? "rotate(-45deg)" : "",
            marginTop: menuOpen ? 8 : 0,
            transition: `all 0.3s ease-in-out`,
          }}
        />
        <div
          className="w-6 h-1 bg-black rounded m-1"
          style={{
            transform: menuOpen ? "rotate(45deg)" : "",
            marginTop: menuOpen ? -8 : 0,
            transition: `all 0.3s ease-in-out`,
          }}
        />
        <div
          className="w-6 h-1 bg-black rounded m-1"
          style={{
            opacity: menuOpen ? 0 : 1,

            transition: `all 0.3s ease-in-out`,
          }}
        />
      </button>
    </>
  );
};
