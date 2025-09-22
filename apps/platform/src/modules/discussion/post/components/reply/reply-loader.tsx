'use client';

import { api } from '@/deps/trpc/react';
import { Button } from '@/lib/shadcn/ui/button';
import { FC, PropsWithChildren, useState } from 'react';
import { PostListRepliesItem } from '../../api/procedures/list-replies';
import { NoPostsCard } from '../top-level-post/no-posts-card';
import { Reply, ReplySkeleton } from './reply';

const RepliesPage: FC<{ page: PostListRepliesItem[] }> = ({ page }) => {
	return (
		<>
			{page.map((reply) => (
				<Reply key={reply.post.id} post={reply} />
			))}
		</>
	);
};

export const ReplyLoader: FC<{
	post: PostListRepliesItem;
	defaultLoadingEnabled?: boolean;
}> = ({ post, defaultLoadingEnabled = true }) => {
	const POST_COUNT = 3;

	const [loadingEnabled, setLoadingEnabled] = useState(defaultLoadingEnabled);

	const query = api.post.listReplies.useInfiniteQuery(
		{ postId: post.post.id, limit: POST_COUNT },
		{
			enabled: loadingEnabled,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false,
			refetchOnReconnect: false,
			refetchOnMount: true,
			refetchInterval: false
		}
	);

	if (!query.data || query.isLoading)
		return (
			<>
				{new Array(POST_COUNT).fill(0).map((_, index) => (
					<ReplySkeleton key={index} />
				))}
			</>
		);

	const hasPosts = query.data?.pages?.[0]?.posts.length !== 0;
	const hasNextPage = query.hasNextPage;

	const remainingReplies =
		post.repliesCount - query.data.pages.length * POST_COUNT;

	const LoadTrigger: FC<PropsWithChildren> = ({ children }) => {
		return (
			<Button
				variant="outline"
				size="sm"
				onClick={() => {
					setLoadingEnabled(true);
					query.fetchNextPage();
				}}
			>
				{children}
			</Button>
		);
	};

	if (!loadingEnabled) {
		return <LoadTrigger>Ucitaj {remainingReplies} komentara</LoadTrigger>;
	}

	if (!hasPosts) {
		return <NoPostsCard />;
	}

	return (
		<>
			<div className="border-l-[2px] border-l-neutral-medium pl-2 ml-2">
				{query.data?.pages.map((page, index) => (
					<RepliesPage key={index} page={page.posts} />
				))}

				{/* TODO: Bug: If a reply is created, load button will not show */}
				{hasNextPage && remainingReplies > 0 && (
					<LoadTrigger>Ucitaj jos {remainingReplies} komentara</LoadTrigger>
				)}
			</div>
		</>
	);
};
