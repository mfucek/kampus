import { Suspense, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/server';

interface LayoutProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}

export const SubjectLayout = async ({
	children,
	params
}: PropsWithChildren<LayoutProps>) => {
	const { collegeSlug, subjectSlug } = await params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	const makeRoute = (page: string) =>
		`/${collegeSlug}/subject/${subjectSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={subject.name} tags={['Predmet']} />
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Rasprava</Tab>
				<Tab route={makeRoute('/materials')}>Materijali</Tab>
				<Tab route={makeRoute('/staff')}>Nastavnici</Tab>
			</Tabs>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
