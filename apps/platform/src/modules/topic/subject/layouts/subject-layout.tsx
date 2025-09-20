import { Suspense, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { ContentPadding } from '@/global/layouts/content-padding';

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

	const subject = await api.topic.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	const makeRoute = (page: string) =>
		`/${collegeSlug}/subject/${subjectSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={subject.name} tags={['Predmet']} />

			<ContentPadding size="lg">
				<Suspense fallback={<Spinner />}>
					<Tabs>
						<Tab route={makeRoute('')}>Rasprava</Tab>
						<Tab route={makeRoute('/materials')}>Materijali</Tab>
						<Tab route={makeRoute('/staff')}>Nastavnici</Tab>
					</Tabs>
				</Suspense>
			</ContentPadding>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
