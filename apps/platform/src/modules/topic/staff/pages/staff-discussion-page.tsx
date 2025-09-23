import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { TopLevelPostsLoader } from '@/modules/discussion/post/components/top-level-post/top-level-posts-loader';
import { DiscussionTitle } from '../../components/discussion-title';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
		staffSlug: string;
	}>;
}

export const StaffDiscussionPage = async ({ params }: PageProps) => {
	const { collegeSlug, staffSlug } = await params;

	const staff = await api.topic.staff.getBySlug({
		staffSlug,
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer topicId={staff.topic.id} />
				<DiscussionTitle />
				<TopLevelPostsLoader topicId={staff.topic.id} />
			</div>
		</ContentPadding>
	);
};
