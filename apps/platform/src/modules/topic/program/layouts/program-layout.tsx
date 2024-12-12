import { Suspense, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/server';

interface LayoutProps {
	params: Promise<{
		collegeSlug: string;
		programSlug: string;
	}>;
}

export const ProgramLayout = async ({
	children,
	params
}: PropsWithChildren<LayoutProps>) => {
	const { collegeSlug, programSlug } = await params;

	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	const makeRoute = (page: string) =>
		`/${collegeSlug}/program/${programSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={program.name} tags={['Smjer']} />
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Rasprava</Tab>
				<Tab route={makeRoute('/subjects')}>Predmeti</Tab>
			</Tabs>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
