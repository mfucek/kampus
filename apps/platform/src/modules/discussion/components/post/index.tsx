'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { formatDistance } from 'date-fns';
import { type FC } from 'react';

import { tiptapExtensions } from '@/deps/tiptap/extensions';
import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { cn } from '@/lib/shadcn/utils';
import { type FullPost } from '@/modules/post/types/full-post';
import { PostActions } from './post-actions';
import { PostFiles } from './post-files';
import { PostThreading } from './post-threading';

export const Post: FC<{
	fullPost: FullPost;
	depthInfo: number[];
	previousThreadDepth?: number[];
	nextThreadDepth?: number[];
	addPadding?: boolean;
}> = ({
	fullPost,
	depthInfo,
	previousThreadDepth,
	nextThreadDepth,
	addPadding = false
}) => {
	const { post } = fullPost;

	const { data: imageUrl } = api.user.profilePicture.getUrl.useQuery({
		userId: post.author.id
	});

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
			<div className={cn('flex flex-col gap-2 w-full', addPadding && 'pb-4')}>
				<div className="flex flex-row gap-2 h-6 items-center">
					<span className="caption">{post.author.name}</span>
					{post.author.badge && (
						<TooltipProvider>
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
						</TooltipProvider>
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

				<PostFiles files={fullPost.documentFiles} />

				<PostActions fullPost={fullPost} />
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
