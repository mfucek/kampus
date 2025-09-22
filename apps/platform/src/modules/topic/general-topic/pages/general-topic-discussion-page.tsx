import { type FC } from 'react';

import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { TopLevelPostsLoader } from '@/modules/discussion/post/components/top-level-post/top-level-posts-loader';
import { DiscussionTitle } from '../../components/discussion-title';

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
				<DiscussionTitle />
				<TopLevelPostsLoader topicId={generalTopic.topic.id} />
			</div>
		</ContentPadding>
	);
};
