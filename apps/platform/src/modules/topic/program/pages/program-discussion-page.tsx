import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { TopLevelPostsLoader } from '@/modules/discussion/post/components/top-level-post/top-level-posts-loader';
import { DiscussionTitle } from '../../components/discussion-title';

interface PageProps {
	params: Promise<{
		programSlug: string;
		collegeSlug: string;
	}>;
}

export const ProgramDiscussionPage = async ({ params }: PageProps) => {
	const { programSlug, collegeSlug } = await params;

	const program = await api.topic.program.getBySlug({
		programSlug,
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer topicId={program.topic.id} />
				<DiscussionTitle />
				<TopLevelPostsLoader topicId={program.topic.id} />
			</div>
		</ContentPadding>
	);
};
