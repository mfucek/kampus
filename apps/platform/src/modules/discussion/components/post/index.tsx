'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { api } from '@/lib/trpc/react';
import { usePostId } from '@/modules/discussion-panel/components/post-id-provider';
import { FullPost } from '@/server/api/routers/post';
import { EditorContent, useEditor } from '@tiptap/react';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { PostThreading } from './post-threading';
import { Reactions } from './reactions';

export const Post: FC<{
	fullPost: FullPost;
	depthInfo: number[];
	previousThreadDepth?: number[];
	nextThreadDepth?: number[];
}> = ({
	fullPost: { post, votes },
	depthInfo,
	previousThreadDepth,
	nextThreadDepth
}) => {
	const { data: imageUrl } = api.account.getUserProfilePictureUrl.useQuery({
		userId: post.author.id
	});

	const Actions = () => {
		const { data: user } = api.account.getUser.useQuery();
		const { setPostId } = usePostId();
		const router = useRouter();
		const utils = api.useUtils();
		const { mutateAsync: deletePost } = api.post.deletePost.useMutation({
			onSuccess: async () => {
				// Invalidate and refetch relevant queries
				await utils.post.invalidate();
				await utils.post.getTopicPostsById.invalidate();
				await utils.post.listPostsByCollegeSlug.invalidate();

				// Force a re-render of the page
				router.refresh();
			}
		});

		const handleDeletePost = () => {
			deletePost({ postId: post.id });
		};

		const handleShare = () => {
			navigator.clipboard.writeText(window.location.href);
		};

		const handleReply = () => {
			setPostId(post.id);
		};

		const numberOfReplies = post._count.replies;

		return (
			<div className="flex flex-row gap-2" suppressHydrationWarning>
				<Reactions votes={votes} postId={post.id} />
				<Button theme="neutral" variant="ghost" size="xs" onClick={handleReply}>
					{numberOfReplies ? `${numberOfReplies} replies` : 'Reply'}
				</Button>
				<Button theme="neutral" variant="ghost" size="xs" onClick={handleShare}>
					Share
				</Button>
				{user?.id === post.author.id && (
					<Button
						theme="neutral"
						variant="ghost"
						size="xs"
						onClick={handleDeletePost}
					>
						Delete
					</Button>
				)}
			</div>
		);
	};

	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		immediatelyRender: false,
		editable: false,
		content: post.body,
		extensions: tiptapExtensions,
		editorProps: {
			attributes: {
				class: 'flex flex-col gap-1'
			}
		}
	});

	const PostBody = () => {
		return (
			<div className="flex flex-col gap-2 pb-6 w-full">
				<div className="flex flex-row gap-2 h-6 items-center">
					<span className="caption">{post.author.displayName}</span>
					{post.author.badge && (
						<Tooltip>
							<TooltipTrigger>
								{post.author.badge === 'Sponzor' ? (
									<div className="caption px-1 rounded-full bg-accent-medium text-accent">
										<Icon icon="crown" className="bg-accent" size={12} />
									</div>
								) : (
									<span className="caption px-2 rounded-full bg-warning-medium text-warning">
										{post.author.badge}
									</span>
								)}
							</TooltipTrigger>
							<TooltipContent side="top">
								Ovaj korisnik podrzava platfromu!
							</TooltipContent>
						</Tooltip>
					)}
					<span className="body-3 text-neutral-strong">
						{formatDistance(post.createdAt, new Date(), {
							addSuffix: true
						})}
					</span>
				</div>
				{!post.body && (
					<p className="body-2 text-neutral-strong">
						[ This post has been deleted ]
					</p>
				)}
				{post.body && editor && <EditorContent editor={editor} />}
				<Actions />
			</div>
		);
	};

	return (
		<div className="flex flex-row gap-2 w-full">
			<PostThreading
				threadDepth={depthInfo}
				imageUrl={imageUrl}
				previousThreadDepth={previousThreadDepth}
				nextThreadDepth={nextThreadDepth}
			/>
			<PostBody />
		</div>
	);
};
