import { Icon } from '@/global/components/icon';
import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';

export const PostFileCard: FC<{
	file: PostListByTopicIdItem['documents'][number];
}> = ({ file }) => {
	return (
		<a
			href={file.downloadUrl}
			key={file.id}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div
				key={file.id}
				className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center overflow-hidden clickable"
			>
				<Icon icon="file-textual" size={24} />
				<p className="caption text-neutral-strong">{file.title}</p>
			</div>
		</a>
	);
};
