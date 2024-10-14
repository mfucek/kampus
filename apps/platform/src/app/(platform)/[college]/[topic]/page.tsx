import type { FC } from "react";

interface PageProps {
  params: {
    college: string;
    topic: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const { topic, college } = params;

  return (
    <div>
      <h1>College: {college}</h1>
      <h1>Topic: {topic}</h1>
    </div>
  );
};

export default Page;
