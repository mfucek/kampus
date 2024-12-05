import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { type DocumentFileType, type FileType } from '@prisma/client';
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

const OnlyImage: FC<{ file: PostFile }> = ({ file }) => {
	return (
		<div>
			<a
				href={file.url!}
				key={file.id}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-block"
			>
				<div className="relative w-full sm:w-[320px] max-h-[400px] rounded-xl overflow-hidden bg-neutral-weak">
					{/* <div className="absolute inset-0 bg-neutral-weak animate-pulse" /> */}
					<Image
						src={file.url!}
						quality={20}
						alt="file"
						width={320}
						height={400}
						className="w-full h-auto max-h-[400px] object-contain"
						// unoptimized
					/>
				</div>
			</a>
		</div>
	);
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
					className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center overflow-hidden clickable"
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
					className="w-[120px] h-[80px] bg-neutral-weak rounded-xl flex flex-col items-center justify-center overflow-hidden clickable"
				>
					<Icon icon="file" size={24} />
				</div>
			</a>
		);
	}

	return null;
};

export const PostFiles: FC<{ files: PostFile[] }> = ({ files }) => {
	if (files.length === 1 && files[0]!.type === 'IMAGE') {
		return <OnlyImage file={files[0]!} />;
	}

	return (
		<div className="flex flex-row w-full gap-2 overflow-x-auto">
			{files?.map((file) => <FileCard file={file} key={file.id} />)}
		</div>
	);
};
