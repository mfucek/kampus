import { EditorContent, useEditor } from '@tiptap/react';
import { type FC } from 'react';

import { tiptapExtensions } from '@/deps/tiptap/extensions';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';
import { type PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';

export const PostBody: FC<{
	body: PostListByTopicIdItem['post']['body'];
}> = ({ body }) => {
	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		immediatelyRender: false,
		editable: false,
		content: body,
		extensions: tiptapExtensions,
		editorProps: {
			attributes: {
				class: 'flex flex-col gap-1'
			}
		}
	});
	if (!editor) return null;

	return <EditorContent editor={editor} />;
};

export const PostBodySkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<Skeleton className="w-full h-6" />
			<Skeleton className="w-full h-6" />
		</div>
	);
};
