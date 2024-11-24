'use client';

import { useToast } from '@/lib/shadcn/ui/use-toast';
import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { api } from '@/lib/trpc/react';
import { type JSONContent, useEditor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelectFiles } from './use-select-files';

const MAX_CHARACTERS = 2000;

export const useComposerEditorOld = ({
	collegeId,
	topicId,
	replyToId
}: {
	collegeId: string;
	topicId?: string;
	replyToId?: string;
}) => {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	return {
		remaining,
		handleSubmit,
		isCreatingPost,
		isDragging,
		containerProps,
		editor,
		files,
		removeFile,
		textValue
	};
};
