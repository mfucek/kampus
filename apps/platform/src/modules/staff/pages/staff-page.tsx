import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { SummarySection } from '@/modules/summary/components/summary-section';
import type { FC } from 'react';

export const StaffPage: FC<{
	staffSlug: string;
	collegeSlug: string;
}> = async ({ staffSlug, collegeSlug }) => {
	const staff = await api.staff.getBySlug({ staffSlug, collegeSlug });

	const fullPosts = await api.post.getTopicPostsById({
		topicId: staff.id
	});

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={staff.college.name}
				topicName={staff.name}
			/>
			<SummarySection />
			<div className="flex flex-col gap-10">
				<Composer
					collegeId={staff.college.id}
					collegeSlug={collegeSlug}
					topicId={staff.id}
				/>
				<div className="flex flex-col">
					{fullPosts.map((fullPost) => (
						<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
					))}
				</div>
			</div>
		</Container>
	);
};
