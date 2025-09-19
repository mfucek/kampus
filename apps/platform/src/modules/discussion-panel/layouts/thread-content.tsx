'use client';

import { type FC } from 'react';

import { api } from '@/deps/trpc/react';
import { Post } from '@/modules/discussion/components/post';
import { NoPostsCard } from '@/modules/discussion/components/post/no-posts-card';
import { PostSkeleton } from '@/modules/discussion/components/post/skeleton';
import { unpackThread } from '@/modules/discussion/utils/unpack-thread';

export const ThreadContent: FC<{ postId: string | null }> = ({ postId }) => {
	const { data: thread } = api.post.getThread.useQuery(
		{
			postId: postId!
		},
		{ enabled: !!postId }
	);
	const unpackedThread = thread ? unpackThread(thread) : [];

	// Waiting for data
	if (!postId || !thread)
		return (
			<div className="flex flex-col w-full">
				{new Array(10).fill(null).map((_, index) => {
					return <PostSkeleton key={index} />;
				})}
			</div>
		);

	// No replies on post
	if (thread.replies.length === 0) return <NoPostsCard />;

	// Display replies
	return (
		<div className="flex flex-col w-full">
			{unpackedThread.map((fullPost, index) => {
				return (
					<Post
						key={fullPost.post.id}
						fullPost={fullPost}
						depthInfo={fullPost.depthInfo}
						previousThreadDepth={
							unpackedThread[index - 1]?.depthInfo ?? undefined
						}
						nextThreadDepth={unpackedThread[index + 1]?.depthInfo ?? undefined}
						addPadding
					/>
				);
			})}
		</div>
	);
};
