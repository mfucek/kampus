'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { useToast } from '@/lib/shadcn/ui/use-toast';
import { cn } from '@/lib/shadcn/utils';
import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { api } from '@/lib/trpc/react';
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useSelectFiles } from '../hooks/use-select-files';
import { EditorToolbar } from './editor-toolbar';

import { Dialog, DialogTrigger } from '@/lib/shadcn/ui/dialog';
import { ComposerFile } from './composer-file';
import { FileDetailsModal } from './file-details-modal';
const MAX_CHARACTERS = 2000;

export const Composer: FC<{
	collegeId: string;
	collegeSlug: string;
	topicId?: string;
	replyToId?: string;
}> = ({ collegeId, topicId, replyToId }) => {
	const utils = api.useUtils();
	const router = useRouter();
	const { toast } = useToast();

	const {
		containerProps,
		files,
		removeFile,
		commitFiles,
		linkFiles,
		isDragging
	} = useSelectFiles();

	const [textValue, setTextValue] = useState('');
	const [value, setValue] = useState<JSONContent>({
		type: 'doc',
		content: [{ type: 'paragraph', content: [] }]
	});

	const remaining = MAX_CHARACTERS - textValue.length;

	const [contentKey, setContentKey] = useState(0);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: tiptapExtensions,
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

	const { mutateAsync: createPost, isPending: isCreatingPost } =
		api.post.createPost.useMutation();

	const handleSubmit = async () => {
		if (isCreatingPost) return;
		if (remaining < 0) {
			toast({
				title: 'Error',
				content: 'Please keep the content less than 2000 characters.',
				variant: 'danger'
			});
			return;
		}
		if (textValue.length <= 0) {
			toast({
				title: 'Error',
				content: 'Post cannot be empty.',
				variant: 'danger'
			});
			return;
		}

		try {
			const files = await commitFiles();

			editor?.commands.clearContent();

			const post = await createPost({
				body: value,
				collegeId,
				topicId,
				replyToId
			});

			await linkFiles(files!, post.id);

			// Invalidate and refetch relevant queries
			await utils.post.invalidate();
			await utils.post.getTopicPostsById.invalidate();
			await utils.post.listPostsByCollegeSlug.invalidate();

			// Force a re-render of the page
			router.refresh();
		} catch (error) {
			console.error(error);
		}
	};

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
		<div className="flex flex-col gap-3 w-full">
			<div
				className={cn(
					'flex flex-col gap-3 pt-3 border border-neutral-medium rounded-lg overflow-hidden',
					isDragging && 'border-accent bg-accent-weak'
				)}
				{...containerProps}
			>
				<div className="flex flex-col">
					{editor && (
						<>
							<EditorToolbar editor={editor} />
							<EditorContent editor={editor} />
						</>
					)}
				</div>
			</div>

			<div className="flex flex-row gap-2">
				{files.map((file, index) => (
					<ComposerFile
						onRemove={() => removeFile(index)}
						onClick={() => {}}
						key={file.key || index}
					/>
				))}
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open modal</Button>
				</DialogTrigger>
				<FileDetailsModal />
			</Dialog>

			<Footer />
		</div>
	);
};
