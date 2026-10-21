import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-grow bg-[#f4edff] transition-colors duration-300 dark:bg-[#2b1e42ec]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
