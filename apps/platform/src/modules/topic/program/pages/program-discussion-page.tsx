import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/discussion/post/components/infinite-scroll-top-level-posts';

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
				<Composer collegeId={program.college.id} topicId={program.id} />
				<InfiniteScrollTopLevelPosts scope={{ topic: { id: program.id } }} />
			</div>
		</ContentPadding>
	);
};
