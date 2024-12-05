'use client';

import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/composer/components';
import { Post } from '@/modules/discussion/components/post';
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
			postId: postId as string
		},
		{ enabled: !!postId }
	);
	const unpackedThread = thread ? unpackThread(thread) : [];

	if (!postId) return null;

	if (!fullPost || !thread)
		return (
			<div className="h-full min-h-[200px] flex flex-col items-center justify-center">
				<Spinner className="w-8 h-8" />
			</div>
		);

	return (
		<>
			<Container className="py-10">
				<div className="w-full h-full flex flex-col">
					<div className="flex flex-col w-full gap-10">
						<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
						<Composer
							collegeId={fullPost.post.collegeId}
							topicId={fullPost.post.topicId ?? undefined}
							replyToId={fullPost.post.id}
						/>

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
										nextThreadDepth={
											unpackedThread[index + 1]?.depthInfo ?? undefined
										}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};
