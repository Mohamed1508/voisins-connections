
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
  withFooter?: boolean;
}

const MainLayout = ({ 
  children, 
  fullHeight = false,
  withFooter = true 
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${fullHeight ? 'flex flex-col' : ''}`}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
