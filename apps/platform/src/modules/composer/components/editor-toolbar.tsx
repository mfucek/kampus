'use client';

import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { useFileStagingContext } from '@/modules/file/contexts/file-staging-provider';
import { useUploadDialog } from '../../file/hooks/use-upload-dialog';
import { useComposerController } from '../contexts/composer-controller-provider';

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
	const { locked } = useComposerController();
	const { addFiles } = useFileStagingContext();
	const { openUploadDialog: openFileDialog } = useUploadDialog(addFiles);

	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href as string;
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
		<div className="flex flex-row gap-3">
			<div className="flex flex-row gap-2">
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('bold') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={locked}
				>
					<Icon icon="text-bold" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('italic') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={locked}
				>
					<Icon icon="text-italic" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('strike') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={locked}
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
					disabled={locked}
				>
					<Icon icon="link" />
				</Button>
				<Button
					size="xs"
					theme="neutral"
					variant={editor.isActive('code') ? 'solid' : 'ghost'}
					iconOnly
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={locked}
				>
					<Icon icon="code" />
				</Button>
			</div>

			<div className="self-stretch w-px bg-neutral-medium my-1" />

			<div className="flex flex-row gap-2">
				{/* <Button
					size="xs"
					theme="neutral"
					variant={'ghost'}
					iconOnly
					onClick={() => openFileDialog()}
					disabled={locked}
				>
					<Icon icon="image" />
				</Button> */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="xs"
								theme="neutral"
								variant={'ghost'}
								iconOnly
								onClick={() => openFileDialog()}
								disabled={locked}
							>
								<Icon icon="file" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							Dodaj materijale - skripte, bilješke, itd.
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* <div className="self-stretch w-px bg-neutral-medium my-1" />

			<div className="flex flex-row gap-2">
				<Button size="xs" theme="neutral" variant={'ghost'} iconOnly>
					<Icon icon="ellipsis" />
				</Button>
			</div> */}
		</div>
	);
};
