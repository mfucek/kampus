'use client';

import { api } from '@/lib/trpc/react';
import { PageHeader } from '@/modules/college/components/page-header';
import { Container } from '@/modules/global/components/container';
import type { FC } from 'react';

interface PageProps {
	params: {
		college: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { college } = params;

	const { data, isLoading } = api.college.getBySlug.useQuery(college);

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader title={data?.name ?? ''} icon="https://picsum.photos/48/48" />
		</Container>
	);
};

export default Page;
