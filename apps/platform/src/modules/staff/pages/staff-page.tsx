import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';
import type { FC } from 'react';

export const StaffPage: FC<{
	staffSlug: string;
	collegeSlug: string;
}> = async ({ staffSlug, collegeSlug }) => {
	const staff = await api.staff.getBySlug({ staffSlug, collegeSlug });

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={staff.college.name}
				topicName={staff.name}
			/>
			{/* <SummarySection /> */}
			<div className="flex flex-col gap-10">
				<Composer collegeId={staff.college.id} topicId={staff.id} />
				<InfiniteScrollTopLevelPosts scope={{ topic: { id: staff.id } }} />
			</div>
		</Container>
	);
};
