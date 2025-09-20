import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { FullPost } from '@/modules/discussion/post/types/full-post';

type DocumentFile = FullPost['documentFiles'][number];

const FileCard: FC<{ file: DocumentFile }> = ({ file }) => {
	return (
		<a
			href={file.url!}
			key={file.fileId}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div
				key={file.fileId}
				className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center overflow-hidden clickable"
			>
				<Icon icon="file-textual" size={24} />
				<p className="caption text-neutral-strong">{file.title}</p>
			</div>
		</a>
	);
};

export const PostFiles: FC<{ files: DocumentFile[] }> = ({ files }) => {
	return (
		<div className="flex flex-row w-full gap-2 overflow-x-auto">
			{files?.map((file) => <FileCard file={file} key={file.fileId} />)}
		</div>
	);
};
