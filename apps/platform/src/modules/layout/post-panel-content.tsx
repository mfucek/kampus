'use client';

import { api } from '@/deps/trpc/react';
import { Container } from '@/global/components/container';
import { FC } from 'react';
import { Composer } from '../composer/components';
import { ComposerSkeleton } from '../composer/components/composer-skeleton';
import {
	HighlightPost,
	HighlightPostSkeleton
} from '../discussion/post/components/highlight-post/highlight-post';
import { ReplyLoader } from '../discussion/post/components/reply/reply-loader';

export const PostContent: FC<{ postId: string }> = ({ postId }) => {
	const postQuery = api.post.getPostById.useQuery({
		postId
	});

	if (postQuery.isLoading || !postQuery.data) {
		return (
			<Container>
				<HighlightPostSkeleton />
				<ComposerSkeleton />
			</Container>
		);
	}

	return (
		<Container>
			<HighlightPost post={postQuery.data} />
			<Composer
				topicId={postQuery.data.post.topicId}
				replyToId={postQuery.data.post.id}
			/>
			Replies:
			<ReplyLoader post={postQuery.data} />
		</Container>
	);
};
