import { MainNav } from "./MainNav";

interface PageLayoutProps {
  showLogout?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  showLogout,
  children,
}) => {
  return (
    <div className="container mx-auto px-40 py-20">
      <MainNav showLogout={showLogout} />
      <main className="pt-10 w-full">{children}</main>
    </div>
  );
};
