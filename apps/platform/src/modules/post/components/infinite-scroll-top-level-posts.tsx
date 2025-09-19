'use client';

import { useEffect, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { api } from '@/deps/trpc/react';
import { Spinner } from '@/global/components/spinner';
import { Post } from '@/modules/discussion/components/post';
import { NoPostsCard } from '@/modules/discussion/components/post/no-posts-card';
import { PostSkeleton } from '@/modules/discussion/components/post/skeleton';
import { type ListPostsItem } from '../api/procedures/list';
import { type TPostScope } from '../schemas/post-scope';

type DepthInfo = number[];

const DynamicPost: FC<{
	post: ListPostsItem;
	depthInfo: DepthInfo;
}> = ({ post, depthInfo }) => {
	// const [expanded, setExpanded] = useState(false);

	return (
		<div className="bg-section p-3 rounded-xl overflow-hidden">
			<Post
				fullPost={{
					post: {
						author: {
							id: post.author.id,
							name: post.author.displayName,
							imageUrl: post.author.imageUrl ?? '',
							badge: post.author.badge ?? ''
						},
						createdAt: post.post.createdAt,
						updatedAt: post.post.updatedAt,
						authorId: post.author.id,
						collegeId: post.post.collegeId,
						topicId: post.post.topicId,
						replyToId: post.post.replyToId,
						id: post.post.id,
						body: post.post.body,
						_count: {
							replies: post.replies.count
						}
					},
					documentFiles: post.documentFiles,
					votes: {
						likes: post.votes.likes,
						dislikes: post.votes.dislikes,
						userVote: post.votes.userVote
					}
				}}
				depthInfo={depthInfo}
			/>
			{/* {post.replies.count > 0 && (
				<Button onClick={() => setExpanded(true)}>
					View {post.replies.count} replies
				</Button>
			)} */}
			{/* {expanded && (<InfiniteScrollTopLevelPosts)} */}
		</div>
	);
};

export const TopLevelPostsPage: FC<{
	page: ListPostsItem[];
}> = ({ page }) => {
	return (
		<>
			{page.map((post) => (
				<DynamicPost key={post.post.id} post={post} depthInfo={[]} />
			))}
		</>
	);
};

export const InfiniteScrollTopLevelPosts: FC<{
	scope: TPostScope;
}> = ({ scope }) => {
	const query = api.post.list.useInfiniteQuery(
		{
			scope,
			limit: 10
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const Loader = () => {
		const { ref, inView } = useInView({});

		useEffect(() => {
			if (inView) {
				query.fetchNextPage().catch(console.error);
			}
		}, [inView]);

		if (!query.hasNextPage)
			return <div className="flex justify-center items-center pt-10 h-40" />;

		return (
			<div className="flex justify-center items-center pt-10 h-40" ref={ref}>
				<Spinner />
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2">
			{/* <button onClick={() => query.refetch()}>Refetch</button> */}

			{!query.data && (
				<>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</>
			)}
			{query.data?.pages.map((page, index) => (
				<TopLevelPostsPage key={index} page={page.posts} />
			))}
			{query.data?.pages?.[0]?.posts.length === 0 && <NoPostsCard />}
			<Loader />
		</div>
	);
};
