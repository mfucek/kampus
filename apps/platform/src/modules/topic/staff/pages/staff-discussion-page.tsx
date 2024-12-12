import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
		staffSlug: string;
	}>;
}

export const StaffDiscussionPage = async ({ params }: PageProps) => {
	const { collegeSlug, staffSlug } = await params;

	const staff = await api.staff.getBySlug({
		staffSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10 px-4 lg:px-0">
			<Composer collegeId={staff.collegeId} topicId={staff.id} />
			<InfiniteScrollTopLevelPosts scope={{ topic: { id: staff.id } }} />
		</div>
	);
};
