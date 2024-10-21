'use client';

import { Spinner } from '@/global/components/spinner';
import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { type JSONContent } from '@tiptap/react';
import { Panel } from 'react-resizable-panels';
import { Container } from '../../../global/components/container';
import { usePostId } from '../components/post-id-provider';

export const TopicLayout = () => {
	const { postId, setPostId } = usePostId();

	const { data: post } = api.post.getPostById.useQuery(
		{
			postId: postId!
		},
		{
			enabled: !!postId
		}
	);

	const Discussion = () => {
		if (!post) return <Spinner />;

		return (
			<>
				<Post
					key={post.id}
					postId={post.id}
					content={post.body as JSONContent}
					createdAt={post.createdAt}
					votes={post.votes}
					author={{
						id: post.author.id,
						displayName: post.author.displayName,
						imageUrl: post.author.imageUrl ?? undefined
					}}
				/>

				<Composer
					collegeId={post.collegeId}
					collegeSlug={''} // @TODO fix this
					topicId={post.topicId ?? undefined}
					replyToId={post.id}
				/>
			</>
		);
	};

	if (!postId) return null;

	return (
		<>
			<ResizeHandle vertical />
			<Panel
				className="rounded-lg bg-section flex flex-col items-center"
				style={{ overflow: 'hidden', overflowY: 'scroll' }}
			>
				<Container className="py-10">
					<Button onClick={() => setPostId(null)}>close</Button>
					<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
						<Discussion />
					</div>
				</Container>
			</Panel>
		</>
	);
};
