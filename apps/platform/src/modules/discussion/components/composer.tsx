'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { Document } from '@tiptap/extension-document';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Editor, EditorContent, JSONContent, useEditor } from '@tiptap/react';
import { useCallback, useMemo, useState } from 'react';
import { Post } from './post';

const EditorToolbar = ({ editor }: { editor: Editor }) => {
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

const MAX_CHARACTERS = 2000;

export const Composer = () => {
	const [textValue, setTextValue] = useState('');
	const [value, setValue] = useState<JSONContent>({
		type: 'doc',
		content: [
			{ type: 'paragraph', content: [{ type: 'text', text: 'asdasd' }] },
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						marks: [{ type: 'bold' }, { type: 'italic' }],
						text: 'asdasd'
					}
				]
			},
			{ type: 'paragraph', content: [{ type: 'text', text: 'asdasda' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'asdasd' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'asdasdasdasd' }] },
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'sasdasdasdasdasd' }]
			},
			{ type: 'paragraph', content: [{ type: 'text', text: 'asdasd' }] }
		]
	});

	const remaining = MAX_CHARACTERS - textValue.length;

	const [contentKey, setContentKey] = useState(0);

	const editor = useEditor({
		extensions: [
			Document,
			Paragraph.configure({
				HTMLAttributes: {
					class: 'element-paragraph'
				}
			}),
			Text,
			Bold,
			Italic,
			Strike,
			Code.configure({
				HTMLAttributes: {
					class: 'element-code'
				}
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
				protocols: ['http', 'https'],
				HTMLAttributes: {
					class: 'element-link'
				}
			})
		],
		content: value,
		editorProps: {
			attributes: {
				class: 'rounded-md p-3 outline-none flex flex-col gap-1'
			}
		},
		onUpdate({ editor }) {
			setValue(editor.getJSON());
			setTextValue(editor.getText());
			setContentKey((prev) => prev + 1); // Increment the key
		}
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
					disabled={remaining < 0}
				>
					Objavi
				</Button>
			</div>
		);
	};

	const memoizedPreviewPost = useMemo(() => {
		return <Post content={value} key={contentKey} />;
	}, [value, contentKey]);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3 pt-3 border border-neutral-medium rounded-lg overflow-hidden">
				<div className="flex flex-col">
					{editor && (
						<>
							<EditorToolbar editor={editor} />
							<EditorContent editor={editor} />
						</>
					)}
				</div>
			</div>
			<Footer />
			{memoizedPreviewPost}
		</div>
	);
};
