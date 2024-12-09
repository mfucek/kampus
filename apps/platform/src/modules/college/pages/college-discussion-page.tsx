import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface PageProps {
	params: {
		collegeSlug: string;
	};
}

export const CollegeDiscussionPage = async ({ params }: PageProps) => {
	const { collegeSlug } = params;
	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10">
			<Composer collegeId={college.id} />
			<InfiniteScrollTopLevelPosts
				scope={{
					college: {
						id: college.id
					}
				}}
			/>
		</div>
	);
};
