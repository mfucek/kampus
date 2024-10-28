import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { DocumentFileType, FileType } from '@prisma/client';
import Image from 'next/image';

type PostFile = {
	id: string;
	key: string;
	type: FileType;
	documentFile:
		| {
				academicYear?: string;
				title?: string;
				types: DocumentFileType[];
		  }
		| undefined
		| null;
	imageFile: {} | null;
	url?: string | null;
};

const FileCard: FC<{ file: PostFile }> = ({ file }) => {
	// return <pre>{JSON.stringify(file, null, 2)}</pre>;

	if (file.type === 'IMAGE') {
		return (
			<a
				href={file.url!}
				key={file.id}
				target="_blank"
				rel="noopener noreferrer"
			>
				<div
					key={file.id}
					className="w-[120px] h-[80px] rounded-xl overflow-hidden relative clickable"
				>
					<div className="absolute inset-0 bg-neutral-weak animate-pulse" />
					<Image
						src={file.url!}
						quality={20}
						alt="file"
						sizes="120px"
						fill
						className="object-cover"
					/>
				</div>
			</a>
		);
	}

	if (file.type === 'PDF') {
		return (
			<a
				href={file.url!}
				key={file.id}
				target="_blank"
				rel="noopener noreferrer"
			>
				<div
					key={file.id}
					className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center clickable"
				>
					<Icon icon="file-textual" size={24} />
					<p className="caption text-neutral-strong">
						{file.documentFile?.title}
					</p>
				</div>
			</a>
		);
	}

	if (file.type === 'ARCHIVE') {
		return (
			<a
				href={file.url!}
				key={file.id}
				target="_blank"
				rel="noopener noreferrer"
			>
				<div
					key={file.id}
					className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center clickable"
				>
					<Icon icon="file" size={24} />
				</div>
			</a>
		);
	}

	return null;
};

export const PostFiles: FC<{ files: PostFile[] }> = ({ files }) => {
	return (
		<div className="flex flex-row w-full gap-2 overflow-x-auto">
			{files?.map((file) => <FileCard file={file} key={file.id} />)}
		</div>
	);
};
