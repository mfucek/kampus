'use client';

import { useEditor } from '@tiptap/react';
import { useState } from 'react';

import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { MAX_CHARACTERS } from '@/modules/discussion/constants/composer';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useComposerFilesContext } from '../contexts/composer-files-provider';

export const useComposerEditor = () => {
	const { body, setBody } = useComposerBodyContext();
	const { addFile } = useComposerFilesContext();

	const [textValue, setTextValue] = useState('');
	const [contentKey, setContentKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const remaining = MAX_CHARACTERS - textValue.length;

	const editor = useEditor({
		immediatelyRender: false,
		extensions: tiptapExtensions,
		content: body,
		editorProps: {
			attributes: {
				class: 'rounded-md p-3 outline-none flex flex-col gap-1'
			}
		},
		onUpdate({ editor }) {
			setBody(editor.getJSON());
			setTextValue(editor.getText());
			setContentKey((prev) => prev + 1); // Increment the key
		}
	});

	return { editor };
};
