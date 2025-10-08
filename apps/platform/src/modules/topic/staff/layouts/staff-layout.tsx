import { Suspense, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Spinner } from '@/global/components/spinner';
import { FollowTopicBar } from '@/modules/follow/components/follow-bar';

interface LayoutProps {
	params: Promise<{
		staffSlug: string;
		collegeSlug: string;
	}>;
}

export const StaffLayout = async ({
	children,
	params
}: PropsWithChildren<LayoutProps>) => {
	const { staffSlug, collegeSlug } = await params;

	const staff = await api.topic.staff.getBySlug({
		staffSlug,
		collegeSlug
	});

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader
				title={staff.topic.name}
				tags={['Nastavnik']}
				breadcrumbs={[
					{
						title: staff.college.topic.shortName ?? staff.college.topic.name,
						link: `/${collegeSlug}`
					},
					{
						title: staff.topic.shortName ?? staff.topic.name,
						link: `/${collegeSlug}/staff/${staffSlug}`
					}
				]}
			/>

			<FollowTopicBar topicId={staff.topic.id} />

			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
