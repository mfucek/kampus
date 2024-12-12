import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface PageProps {
	params: Promise<{
		programSlug: string;
		collegeSlug: string;
	}>;
}

export const ProgramDiscussionPage = async ({ params }: PageProps) => {
	const { programSlug, collegeSlug } = await params;

	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10 px-4 lg:px-0">
			<Composer collegeId={program.college.id} topicId={program.id} />
			<InfiniteScrollTopLevelPosts scope={{ topic: { id: program.id } }} />
		</div>
	);
};
