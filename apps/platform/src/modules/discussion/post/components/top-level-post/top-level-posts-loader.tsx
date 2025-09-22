'use client';

import { api } from '@/deps/trpc/react';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { NoPostsCard } from './no-posts-card';
import { TopLevelPost, TopLevelPostSkeleton } from './top-level-post';

const TopLevelPostsPage: FC<{
	page: PostListByTopicIdItem[];
}> = ({ page }) => {
	return (
		<>
			{page.map((post) => (
				<TopLevelPost key={post.post.id} post={post} />
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

export const TopLevelPostsLoader: FC<{ topicId: string }> = ({ topicId }) => {
	const POST_COUNT = 2;

	const query = api.post.listByTopicId.useInfiniteQuery(
		{ topicId, limit: POST_COUNT },
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
					<TopLevelPostSkeleton key={index} />
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2">
			{query.data?.pages.map((page, index) => (
				<TopLevelPostsPage key={index} page={page.posts} />
			))}

			{!hasPosts && <NoPostsCard />}
			{hasPosts && hasNextPage && <LoadTrigger />}
			{hasPosts && !hasNextPage && <EndOfPosts />}
		</div>
	);
};
