import { api } from '@/lib/trpc/server';

import { ContentPadding } from '@/global/layouts/content-padding';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeDiscussionPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;
	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer collegeId={college.id} />

				<div className="flex flex-col gap-2">
					<div className="flex flex-row justify-between items-center">
						<div className="title-2">Rasprava</div>
						<Select value="newest" disabled>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder="Sortiraj" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Najnovije</SelectItem>
								<SelectItem value="oldest">Najstarije</SelectItem>
								<SelectItem value="relevant">Po relevantnosti</SelectItem>
								<SelectItem value="votes">Po glasovima</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<InfiniteScrollTopLevelPosts
						scope={{
							college: {
								id: college.id
							}
						}}
					/>
				</div>
			</div>
		</ContentPadding>
	);
};
