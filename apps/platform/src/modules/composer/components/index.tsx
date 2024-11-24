'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { type FC } from 'react';

import { useComposerEditorOld } from '../hooks/use-composer-editor-old';
import { ComposerProvider } from '../providers/composer-provider';
import { ComposerBody } from './composer-body';
import { ComposerFiles } from './composer-files';
import { ComposerFooter } from './composer-footer';

export const Composer: FC<{
	collegeId: string;
	collegeSlug: string;
	topicId?: string;
	replyToId?: string;
}> = ({ collegeId, topicId, replyToId }) => {
	const {
		remaining,
		handleSubmit,
		isCreatingPost,
		isDragging,
		containerProps,
		editor,
		files,
		removeFile,
		textValue
	} = useComposerEditorOld({
		collegeId,
		topicId,
		replyToId
	});

	const Footer = () => {
		return (
			<div className="flex flex-row gap-2 items-center">
				<p
					className={cn('w-full text-neutral-strong body-3', {
						'text-danger': remaining < 0
					})}
				>
					{remaining} znakova preostalo.
				</p>
				<Button
					theme="accent"
					variant="solid"
					size="sm"
					disabled={remaining < 0 || textValue.length <= 0}
					onClick={handleSubmit}
					loading={isCreatingPost}
				>
					Objavi
				</Button>
			</div>
		);
	};

	return (
		<ComposerProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
		>
			<div className="flex flex-col gap-3 w-full">
				<ComposerBody />
				<ComposerFiles />
				<ComposerFooter />
			</div>
		</ComposerProvider>
	);
};
