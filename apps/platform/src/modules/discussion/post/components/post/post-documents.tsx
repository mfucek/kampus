import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostFileCard } from './post-file-card';

export const PostDocuments: FC<{
	documents: PostListByTopicIdItem['documents'];
}> = ({ documents }) => {
	return (
		<div className="flex flex-row w-full gap-2 overflow-x-auto">
			{documents.map((file) => (
				<PostFileCard file={file} key={file.id} />
			))}
		</div>
	);
};
