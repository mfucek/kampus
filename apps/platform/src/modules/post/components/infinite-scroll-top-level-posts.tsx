'use client';

import { useEffect, useState, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/react';
import { type ListPostsItem } from '../api/procedures/list';
import { type TPostScope } from '../schemas/post-scope';

const DynamicPost: FC<{
	post: ListPostsItem;
}> = ({ post }) => {
	return (
		<div className="py-20 bg-neutral-weak">
			{JSON.stringify(post.post.body)}
		</div>
	);
};

export const TopLevelPostsPage: FC<{
	page: ListPostsItem[];
}> = ({ page }) => {
	return (
		<div className="p-10 border flex flex-col gap-10">
			{page.map((post) => (
				<DynamicPost key={post.post.id} post={post} />
			))}
		</div>
	);
};

export const InfiniteScrollTopLevelPosts: FC<{
	scope: TPostScope;
}> = ({ scope }) => {
	const [page, setPage] = useState(0);

	const query = api.post.list.useInfiniteQuery(
		{
			scope,
			limit: 5
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const numOfPages = query.data?.pages[0]?.totalPages ?? 0;
	const canGoNext = page + 1 < numOfPages;

	const Loader = () => {
		const { ref, inView, entry } = useInView({});

		useEffect(() => {
			if (inView && canGoNext) {
				console.log('in view');
				query.fetchNextPage();
			}
		}, [inView]);

		return (
			<div
				className="py-20 bg-neutral-weak flex justify-center items-center"
				ref={ref}
			>
				<Spinner />
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-10">
			{query.data?.pages.map((page, index) => (
				<TopLevelPostsPage key={index} page={page.posts} />
			))}
			<Loader />
		</div>
	);
};
