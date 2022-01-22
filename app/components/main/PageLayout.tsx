import { MainNav } from "./MainNav";

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div className="container mx-auto px-60 py-20">
      <main className="pt-10 w-full">{children}</main>
    </div>
  );
};
