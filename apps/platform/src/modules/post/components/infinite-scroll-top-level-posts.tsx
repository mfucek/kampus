'use client';

import { useEffect, useState, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { Spinner } from '@/global/components/spinner';
import { api } from '@/lib/trpc/react';
import { Post } from '@/modules/discussion/components/post';
import { JSONContent } from '@tiptap/react';
import { type ListPostsItem } from '../api/procedures/list';
import { type TPostScope } from '../schemas/post-scope';

const DynamicPost: FC<{
	post: ListPostsItem;
}> = ({ post }) => {
	return (
		<Post
			fullPost={{
				post: {
					author: {
						id: post.author.id,
						displayName: post.author.displayName,
						imageUrl: post.author.imageUrl,
						badge: post.author.badge,
						accountId: '',
						createdAt: new Date(),
						updatedAt: new Date()
					},
					authorId: '1',
					id: '1',
					body: post.post.body as JSONContent,
					createdAt: new Date(),
					_count: {
						replies: 0
					}
				},
				files: [],
				votes: {
					likes: 0,
					dislikes: 0,
					userVote: null
				}
			}}
			depthInfo={[]}
		/>
	);
};

export const TopLevelPostsPage: FC<{
	page: ListPostsItem[];
}> = ({ page }) => {
	return (
		<div className="p-10 border flex flex-col">
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
	const canGoNext = page <= numOfPages - 1;

	const Loader = () => {
		const { ref, inView, entry } = useInView({});

		useEffect(() => {
			if (inView) {
				console.log('in view');
				console.log(query.hasNextPage);
				query.fetchNextPage();
			}
		}, [inView]);

		if (!query.hasNextPage) return null;

		return (
			<div className="flex justify-center items-center" ref={ref}>
				<Spinner />
			</div>
		);
	};

	return (
		<div className="flex flex-col">
			{query.data?.pages.map((page, index) => (
				<TopLevelPostsPage key={index} page={page.posts} />
			))}
			<Loader />
		</div>
	);
};
