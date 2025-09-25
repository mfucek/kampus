import { Suspense, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { ContentPadding } from '@/global/layouts/content-padding';
import { FollowTopicBar } from '@/modules/follow/components/follow-bar';

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
			<PageHeader
				title={subject.topic.name}
				tags={['Predmet']}
				breadcrumbs={[
					{
						title:
							subject.college.topic.shortName ?? subject.college.topic.name,
						link: `/${collegeSlug}`
					},
					{
						title: subject.topic.shortName ?? subject.topic.name,
						link: `/${collegeSlug}/subject/${subjectSlug}`
					}
				]}
			/>

			<FollowTopicBar topicId={subject.topic.id} />

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
