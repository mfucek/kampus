import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}

export const SubjectDiscussionPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10 px-4 lg:px-0">
			<Composer collegeId={subject.collegeId} topicId={subject.id} />
			<InfiniteScrollTopLevelPosts scope={{ topic: { id: subject.id } }} />
		</div>
	);
};
