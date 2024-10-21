'use client';

import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { api } from '@/lib/trpc/react';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { JSONContent } from '@tiptap/react';
import { useSearchParams } from 'next/navigation';
import { Panel } from 'react-resizable-panels';
import { Container } from '../components/container';

export const TopicLayout = () => {
	const postId = useSearchParams().get('postId');
	// @TODO: make postId be a context and only set from the search params

	const { data: post } = api.post.getPostById.useQuery(
		{
			postId: postId!
		},
		{
			enabled: !!postId
		}
	);

	if (!postId || !post) return null;

	return (
		<>
			<ResizeHandle vertical />
			<Panel
				className="rounded-lg bg-section flex flex-col items-center"
				style={{ overflow: 'hidden', overflowY: 'scroll' }}
			>
				<Container className="py-10">
					<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
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
					</div>
				</Container>
			</Panel>
		</>
	);
};
