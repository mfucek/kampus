'use client';

import { Icon } from '@/global/components/icon';
import { Spinner } from '@/global/components/spinner';
import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { unpackThread } from '@/modules/discussion/utils/unpack-thread';
import { Fragment } from 'react';
import { Panel } from 'react-resizable-panels';
import { Container } from '../../../global/components/container';
import { usePostId } from '../components/post-id-provider';

export const TopicLayout = () => {
	const { postId, setPostId } = usePostId();

	const { data: fullPost } = api.post.getPostById.useQuery(
		{
			postId: postId!
		},
		{
			enabled: !!postId
		}
	);

	const Discussion = () => {
		const { data: thread } = api.post.getThread.useQuery(
			{
				postId: postId as string
			},
			{ enabled: !!postId }
		);

		const unpackedThread = thread ? unpackThread(thread) : [];

		if (!fullPost) return <Spinner />;

		return (
			<>
				<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
				<Composer
					collegeId={fullPost.post.collegeId}
					collegeSlug={''} // @TODO fix this
					topicId={fullPost.post.topicId ?? undefined}
					replyToId={fullPost.post.id}
				/>

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
			</>
		);
	};

	if (!postId) return null;

	return (
		<>
			<ResizeHandle vertical />
			<Panel
				className="rounded-lg bg-section flex flex-col items-center relative"
				style={{ overflow: 'hidden', overflowY: 'scroll' }}
				order={1}
				id="discussion-panel"
			>
				<Container className="py-10">
					<div className="absolute top-6 right-6">
						<Button variant="ghost" iconOnly onClick={() => setPostId(null)}>
							<Icon icon="close" />
						</Button>
					</div>
					<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
						<Discussion />
					</div>
				</Container>
			</Panel>
		</>
	);
};
