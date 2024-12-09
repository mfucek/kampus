import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface StaffDiscussionPageProps {
	params: {
		collegeSlug: string;
		staffSlug: string;
	};
}

export const StaffDiscussionPage = async ({
	params
}: StaffDiscussionPageProps) => {
	const { collegeSlug, staffSlug } = params;

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
