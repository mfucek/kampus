'use client';

import { Container } from '@/global/components/container';
import { PostContent } from '@/modules/layout/post-panel-content';
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
						<PostContent postId={postId} />
					</div>
				</div>
			</Container>
		</>
	);
};
