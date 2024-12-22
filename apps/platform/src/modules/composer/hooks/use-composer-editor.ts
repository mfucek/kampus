'use client';

import { useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';

import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useComposerController } from '../contexts/composer-controller-provider';

export const useComposerEditor = () => {
	const { body, setBody, setCharacterCount } = useComposerBodyContext();
	const { locked } = useComposerController();

	// re-rendering fix
	const [_contentKey, setContentKey] = useState(0);
	const enabled = !locked;

	const editor = useEditor({
		immediatelyRender: false,
		extensions: tiptapExtensions,
		content: body,
		editorProps: {
			attributes: {
				class: 'rounded-md outline-none flex flex-col gap-1'
			}
		},
		onBlur: () => {},
		editable: enabled,
		onUpdate({ editor }) {
			setBody(editor.getJSON());
			setCharacterCount(editor.getText().length);
			setContentKey((prev) => prev + 1);
		}
	});

	useEffect(() => {
		if (body === null) {
			editor?.commands.clearContent();
		}
	}, [editor, body]);

	return { editor, enabled };
};
