import { api } from '@/deps/trpc/server';

import { ContentPadding } from '@/global/layouts/content-padding';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/discussion/post/components/infinite-scroll-top-level-posts';
import { FC } from 'react';

interface PageProps {
	params: Promise<{
		generalTopicSlug: string;
	}>;
}

export const GeneralTopicDiscussionPage: FC<PageProps> = async ({ params }) => {
	const { generalTopicSlug } = await params;
	const generalTopic = await api.topic.general.getBySlug({
		generalTopicSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer topicId={generalTopic.topic.id} />

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
							topicId: generalTopic.topic.id
						}}
					/>
				</div>
			</div>
		</ContentPadding>
	);
};
