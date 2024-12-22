'use client';

import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/composer/components';
import { ComposerSkeleton } from '@/modules/composer/components/composer-skeleton';
import { Post } from '@/modules/discussion/components/post';
import { NoPostsCard } from '@/modules/discussion/components/post/no-posts-card';
import { PostSkeleton } from '@/modules/discussion/components/post/skeleton';
import { unpackThread } from '@/modules/discussion/utils/unpack-thread';
import { Container } from '../../../global/components/container';
import { usePostId } from '../components/post-id-provider';

export const ThreadContent = () => {
	const { postId } = usePostId();

	const { data: fullPost } = api.post.getPostById.useQuery(
		{
			postId: postId!
		},
		{
			enabled: !!postId
		}
	);

	const { data: thread } = api.post.getThread.useQuery(
		{
			postId: postId!
		},
		{ enabled: !!postId }
	);
	const unpackedThread = thread ? unpackThread(thread) : [];

	if (!postId) return null;

	return (
		<>
			<Container className="py-10">
				<div className="w-full h-full flex flex-col px-4">
					<div className="flex flex-col w-full gap-10">
						{!fullPost && (
							<>
								<PostSkeleton />
								<ComposerSkeleton />
							</>
						)}
						{fullPost && (
							<>
								<Post
									key={fullPost.post.id}
									fullPost={fullPost}
									depthInfo={[]}
								/>
								<Composer
									collegeId={fullPost.post.collegeId}
									topicId={fullPost.post.topicId ?? undefined}
									replyToId={fullPost.post.id}
									className="border border-neutral-medium"
								/>
							</>
						)}

						<div className="flex flex-col w-full">
							{!thread &&
								new Array(10).fill(null).map((_, index) => {
									return <PostSkeleton key={index} />;
								})}
							{thread && (
								<>
									{unpackedThread.map((fullPost, index) => {
										return (
											<Post
												key={fullPost.post.id}
												fullPost={fullPost}
												depthInfo={fullPost.depthInfo}
												previousThreadDepth={
													unpackedThread[index - 1]?.depthInfo ?? undefined
												}
												nextThreadDepth={
													unpackedThread[index + 1]?.depthInfo ?? undefined
												}
											/>
										);
									})}
								</>
							)}
							{thread && thread.replies.length === 0 && <NoPostsCard />}
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};
