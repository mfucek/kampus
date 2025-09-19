'use client';

import { type FC } from 'react';

import { api } from '@/deps/trpc/react';
import { Composer } from '@/modules/composer/components';
import { ComposerSkeleton } from '@/modules/composer/components/composer-skeleton';
import { Post } from '@/modules/discussion/components/post';
import { PostSkeleton } from '@/modules/discussion/components/post/skeleton';

export const PostHeader: FC<{
	postId: string | null;
}> = ({ postId }) => {
	const { data: fullPost } = api.post.getPostById.useQuery(
		{
			postId: postId!
		},
		{ enabled: !!postId }
	);

	if (!postId || !fullPost)
		return (
			<>
				<PostSkeleton />
				<ComposerSkeleton />
			</>
		);

	return (
		<>
			<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
			<Composer
				collegeId={fullPost.post.collegeId}
				topicId={fullPost.post.topicId ?? undefined}
				replyToId={fullPost.post.id}
				className="border border-neutral-medium"
			/>
		</>
	);
};
