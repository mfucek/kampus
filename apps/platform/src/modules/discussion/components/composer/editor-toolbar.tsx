'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}, [editor]);

	const handleLink = useCallback(() => {
		if (editor.isActive('link')) {
			editor.chain().focus().unsetLink().run();
		} else {
			setLink();
		}
	}, [editor, setLink]);

	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-row gap-3 px-3">
			<div className="flex flex-row gap-2">
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('bold') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleBold().run()}
				>
					<Icon icon="text-bold" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('italic') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleItalic().run()}
				>
					<Icon icon="text-italic" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('strike') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleStrike().run()}
				>
					<Icon icon="text-strikethrough" />
				</Button>
			</div>

			<div className="self-stretch w-px bg-neutral-medium my-1" />

			<div className="flex flex-row gap-2">
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('link') ? 'solid' : 'ghost'}
					iconOnly
					onClick={handleLink}
				>
					<Icon icon="link" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('code') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleCode().run()}
				>
					<Icon icon="code" />
				</Button>
			</div>

			<div className="self-stretch w-px bg-neutral-medium my-1" />

			<div className="flex flex-row gap-2">
				<Button size="xs" theme="neutral" variant={'ghost'} iconOnly disabled>
					<Icon icon="image" />
				</Button>
				<Button size="xs" theme="neutral" variant={'ghost'} iconOnly disabled>
					<Icon icon="file" />
				</Button>
			</div>

			<div className="self-stretch w-px bg-neutral-medium my-1" />

			<div className="flex flex-row gap-2">
				<Button size="xs" theme="neutral" variant={'ghost'} iconOnly disabled>
					<Icon icon="ellipsis" />
				</Button>
			</div>
		</div>
	);
};
