import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';
import type { FC } from 'react';
import { Post } from '../components/post';

export const PostPage: FC<{ postId: string }> = async ({ postId }) => {
	const post = await api.post.getPostById({ postId });

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			{/* <PageHeader collegeSlug={collegeSlug} collegeName={college.name} /> */}

			<Post fullPost={post} depthInfo={[]} />

			<div className="flex flex-col gap-10">
				<Composer collegeId={post.post.collegeId} replyToId={postId} />
				<InfiniteScrollTopLevelPosts
					scope={{
						// college: {
						// 	id: collegeId
						// },
						replyToPost: {
							id: postId
						}
					}}
				/>
				{/* <div className="flex flex-col">
				{fullPosts.map((fullPost) => (
					<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
				))}
			</div> */}
			</div>
		</Container>
	);
};
