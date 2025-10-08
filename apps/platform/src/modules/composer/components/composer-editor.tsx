'use client';

import { EditorContent } from '@tiptap/react';

import { cn } from '@/lib/shadcn/utils';
import { useComposerEditor } from '../hooks/use-composer-editor';
import { EditorToolbar } from './editor-toolbar';

export const ComposerEditor = () => {
	const { editor, enabled } = useComposerEditor();

	if (!editor) return null;

	return (
		<>
			<EditorToolbar editor={editor} />
			<EditorContent
				editor={editor}
				className={cn(!enabled && 'opacity-50', 'text-neutral')}
			/>
		</>
	);
};
