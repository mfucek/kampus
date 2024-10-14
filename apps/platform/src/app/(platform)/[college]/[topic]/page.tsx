import { PageHeader } from '@/modules/college/components/page-header';
import { Container } from '@/modules/global/components/container';
import type { FC } from 'react';

interface PageProps {
	params: {
		college: string;
		topic: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { topic, college } = params;

	return (
		<Container className="flex flex-col gap-4 py-10">
			<PageHeader
				title={college}
				subtitle={topic}
				icon="https://picsum.photos/48/48"
			/>
		</Container>
	);
};

export default Page;
