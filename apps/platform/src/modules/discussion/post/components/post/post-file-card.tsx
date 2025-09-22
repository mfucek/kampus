import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { formatFileSize } from '@/utils/format-file-size';
import Image from 'next/image';
import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';

export const PostFileCard: FC<{
	file: PostListByTopicIdItem['documents'][number];
}> = ({ file }) => {
	const isImage = file.contentType.startsWith('image/');

	return (
		<a
			href={file.downloadUrl}
			key={file.id}
			target="_blank"
			rel="noopener noreferrer"
			className="flex flex-col gap-2 w-[120px] clickable group"
		>
			<div className="relative">
				<div
					key={file.id}
					className={cn(
						'h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center relative overflow-hidden',
						'duration-300 group-hover:opacity-50'
					)}
				>
					{!isImage && <Icon icon="file-textual" size={24} />}
					{isImage && (
						<Image src={file.downloadUrl} alt={file.title ?? 'file'} fill />
					)}
				</div>

				<div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 duration-200 scale-110 group-hover:scale-100 flex flex-col gap-2 items-center justify-center">
					<Icon icon="download" size={24} />
					<p className="caption text-neutral-strong">
						{formatFileSize(file.size)}
					</p>
				</div>
			</div>

			<p className="caption text-neutral line-clamp-2 px-2">{file.title}</p>
		</a>
	);
};
