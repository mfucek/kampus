import { Container } from '@/global/components/container';
import { PageHeader } from '@/modules/college/components/page-header';
import { SummarySection } from '@/modules/summary/components/summary-section';
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
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				title={college}
				subtitle={topic}
				icon="https://picsum.photos/48/48"
			/>
			<SummarySection />
		</Container>
	);
};

export default Page;
