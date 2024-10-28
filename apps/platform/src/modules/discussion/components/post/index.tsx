'use client';

import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import { formatDistance } from 'date-fns';
import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { api } from '@/lib/trpc/react';
import { DocumentFileType, FileType, VoteType } from '@prisma/client';
import { PostActions } from './post-actions';
import { PostFiles } from './post-files';
import { PostThreading } from './post-threading';

type PostInterface = {
	post: {
		author: {
			id: string;
			displayName: string;
			imageUrl: string | null;
			badge: string | null;
			accountId: string;
		};
		authorId: string | null;
		id: string;
		body: JSONContent | null;
		createdAt: Date;
		_count: {
			replies: number;
		};
	};
	files: {
		id: string;
		key: string;
		type: FileType;
		documentFile:
			| {
					academicYear?: string;
					title?: string;
					types: DocumentFileType[];
			  }
			| undefined
			| null;
		imageFile: {} | null;
		url?: string | null;
	}[];
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
};

export const Post: FC<{
	fullPost: PostInterface;
	depthInfo: number[];
	previousThreadDepth?: number[];
	nextThreadDepth?: number[];
}> = ({ fullPost, depthInfo, previousThreadDepth, nextThreadDepth }) => {
	const { post } = fullPost;

	const { data: imageUrl } = api.account.getUserProfilePictureUrl.useQuery({
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

				<PostFiles files={fullPost.files} />
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
