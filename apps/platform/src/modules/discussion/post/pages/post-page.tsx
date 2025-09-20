'use client';

import { Container } from '@/global/components/container';
import { PostHeader } from '@/modules/discussion/discussion-panel/components/post-header';
import { ThreadContent } from '@/modules/discussion/discussion-panel/layouts/thread-content';
import { use } from 'react';

interface PageProps {
	params: Promise<{
		postId: string;
	}>;
}

export const PostPage = ({ params }: PageProps) => {
	const { postId } = use(params);

	if (!postId) return null;

	return (
		<>
			<Container>
				<div className="w-full h-full flex flex-col px-4">
					<div className="flex flex-col w-full gap-10">
						<PostHeader postId={postId} />
						<ThreadContent postId={postId} />
					</div>
				</div>
			</Container>
		</>
	);
};
