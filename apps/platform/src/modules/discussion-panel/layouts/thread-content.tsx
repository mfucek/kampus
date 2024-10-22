'use client';

import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { unpackThread } from '@/modules/discussion/utils/unpack-thread';
import { Fragment } from 'react';
import { Container } from '../../../global/components/container';
import { usePostId } from '../components/post-id-provider';

export const ThreadContent = () => {
	const { postId, setPostId } = usePostId();

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

	if (!fullPost) return <Spinner />;

	return (
		<>
			<Container className="py-10">
				<div className="w-full h-full flex flex-col">
					<div className="flex flex-col w-full gap-10">
						<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
						<Composer
							collegeId={fullPost.post.collegeId}
							collegeSlug={''} // @TODO fix this
							topicId={fullPost.post.topicId ?? undefined}
							replyToId={fullPost.post.id}
						/>

						<div className="flex flex-col w-full">
							{unpackedThread.map((fullPost, index) => {
								return (
									<Fragment key={fullPost.post.id}>
										<Post
											fullPost={fullPost}
											depthInfo={fullPost.depthInfo}
											previousThreadDepth={
												unpackedThread[index - 1]?.depthInfo ?? undefined
											}
											nextThreadDepth={
												unpackedThread[index + 1]?.depthInfo ?? undefined
											}
										/>
									</Fragment>
								);
							})}
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};
