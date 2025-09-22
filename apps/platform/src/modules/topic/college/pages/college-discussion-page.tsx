import { api } from '@/deps/trpc/server';

import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { TopLevelPostsLoader } from '@/modules/discussion/post/components/top-level-post/top-level-posts-loader';
import { FC } from 'react';
import { DiscussionTitle } from '../../components/discussion-title';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

// export const CollegeDiscussionPage = async ({ params }: PageProps) => {
export const CollegeDiscussionPage: FC<PageProps> = async ({ params }) => {
	const { collegeSlug } = await params;

	const college = await api.topic.college.getBySlug({
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer topicId={college.topic.id} />
				<DiscussionTitle />
				<TopLevelPostsLoader topicId={college.topic.id} />
			</div>
		</ContentPadding>
	);
};
