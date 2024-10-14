import type { FC } from "react";

interface PageProps {
  params: {
    college: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const { college } = params;

  return (
    <div>
      <h1>College: {college}</h1>
    </div>
  );
};

export default Page;
