import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { type DocumentFileType } from '@prisma/client';

type PostFile = {
	id: string;
	key: string;
	documentFile:
		| {
				academicYear?: string;
				title?: string;
				types: DocumentFileType[];
		  }
		| undefined
		| null;
	imageFile: object | null;
	url?: string | null;
};

const FileCard: FC<{ file: PostFile }> = ({ file }) => {
	return (
		<a href={file.url!} key={file.id} target="_blank" rel="noopener noreferrer">
			<div
				key={file.id}
				className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center overflow-hidden clickable"
			>
				<Icon icon="file-textual" size={24} />
				<p className="caption text-neutral-strong">
					{file.documentFile?.title}
				</p>
			</div>
		</a>
	);
};

export const PostFiles: FC<{ files: PostFile[] }> = ({ files }) => {
	return (
		<div className="flex flex-row w-full gap-2 overflow-x-auto">
			{files?.map((file) => <FileCard file={file} key={file.id} />)}
		</div>
	);
};
