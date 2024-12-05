'use client';

import { EditorContent } from '@tiptap/react';

import { cn } from '@/lib/shadcn/utils';
import { useComposerDragUpload } from '../hooks/use-composer-drag-upload';
import { useComposerEditor } from '../hooks/use-composer-editor';
import { EditorToolbar } from './editor-toolbar';

export const ComposerEditor = () => {
	const { editor, enabled } = useComposerEditor();
	const { uploadAreaProps, isDragging } = useComposerDragUpload();

	return (
		<div
			className={cn(
				'flex flex-col gap-3 pt-3 border border-neutral-medium rounded-lg overflow-hidden',
				isDragging && 'border-accent bg-accent-weak'
			)}
			{...uploadAreaProps}
		>
			<div className="flex flex-col">
				{editor && (
					<>
						<EditorToolbar editor={editor} />
						<EditorContent
							editor={editor}
							className={cn(!enabled && 'opacity-50')}
						/>
					</>
				)}
			</div>
		</div>
	);
};
