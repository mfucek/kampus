import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/discussion/post/components/infinite-scroll-top-level-posts';

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
		<ContentPadding size="lg">
			<div className="flex flex-col gap-10">
				<Composer collegeId={staff.collegeId} topicId={staff.id} />
				<InfiniteScrollTopLevelPosts scope={{ topic: { id: staff.id } }} />
			</div>
		</ContentPadding>
	);
};
