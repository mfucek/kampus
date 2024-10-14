import type { FC, PropsWithChildren } from "react";
import { Navbar } from "~/modules/global/components/navbar";

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default PublicLayout;
