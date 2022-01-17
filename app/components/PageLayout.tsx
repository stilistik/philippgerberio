import { MainNav } from "./MainNav";

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div className="container mx-auto px-40 py-20">
      <MainNav />
      {children}
    </div>
  );
};
