'use client';

import { type FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { api } from '@/deps/trpc/react';
import { type PostListByAuthorIdItem } from '../../api/procedures/list-by-author-id';
import { FeedPost, FeedPostSkeleton } from './feed-post';
import { NoAuthorFeedPostsCard } from './no-author-feed-posts-card';

const AuthorPostsPage: FC<{
	page: PostListByAuthorIdItem[];
}> = ({ page }) => {
	return (
		<>
			{page.map((post) => (
				<FeedPost key={post.post.id} post={post} />
			))}
		</>
	);
};

export const EndOfPosts = () => {
	return (
		<p className="text-center body-2 text-neutral-medium py-6">
			Kraj rasprave.
		</p>
	);
};

export const AuthorFeedPostsLoader: FC<{ authorId: string }> = ({
	authorId
}) => {
	const POST_COUNT = 10;

	const query = api.post.listByAuthorId.useInfiniteQuery(
		{ authorId: authorId, limit: POST_COUNT },
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false,
			refetchOnReconnect: false,
			refetchInterval: false
		}
	);

	const hasPosts = query.data?.pages?.[0]?.posts.length !== 0;
	const hasNextPage = query.hasNextPage;

	const LoadTrigger = () => {
		const { ref, inView } = useInView({});

		useEffect(() => {
			if (inView) {
				query.fetchNextPage().catch(console.error);
			}
		}, [inView]);

		return (
			<div className="flex flex-col gap-2" ref={ref}>
				{new Array(POST_COUNT).fill(0).map((_, index) => (
					<FeedPostSkeleton key={index} />
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2">
			{query.data?.pages.map((page, index) => (
				<AuthorPostsPage key={index} page={page.posts} />
			))}

			{!hasPosts && <NoAuthorFeedPostsCard />}
			{hasPosts && hasNextPage && <LoadTrigger />}
			{hasPosts && !hasNextPage && <EndOfPosts />}
		</div>
	);
};
