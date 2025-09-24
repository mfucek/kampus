'use client';

import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { formatFileSize } from '@/utils/format-file-size';
import {
	type StagedFile,
	useFileStagingContext
} from '../../../file/contexts/file-staging-provider';

const SidebarFile: FC<{
	file: StagedFile;
	selected?: boolean;
	onClick: () => void;
	onRemove: () => void;
}> = ({ selected = false, onClick, file, onRemove }) => {
	return (
		<div
			className={cn(
				'px-2 py-3 rounded-lg flex flex-row gap-2 items-center clickable md:w-auto w-[calc(50%-20px)] grow-0 shrink-0',
				selected ? 'bg-accent-weak' : 'bg-neutral-weak md:bg-transparent'
			)}
			onClick={onClick}
		>
			<div className="shrink-0">
				<Icon icon="file" className="bg-neutral-strong" size={16} />
			</div>

			<div className="flex flex-col flex-1 overflow-hidden">
				<p
					className={cn(
						'body-3 w-full whitespace-nowrap',
						selected ? 'text-neutral' : 'text-neutral-strong'
					)}
				>
					{file.name}
				</p>
				<p
					className={cn(
						'body-3 w-full',
						selected ? 'text-neutral' : 'text-neutral-strong'
					)}
				>
					{formatFileSize(file.file.size)}
				</p>
			</div>

			<div className="shrink-0">
				<Button
					variant="ghost-weak"
					size="xs"
					iconOnly
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
				>
					<Icon icon="trash" size={16} />
				</Button>
			</div>
		</div>
	);
};
export const FileDetailsList = () => {
	const { files, removeFile, fileDetailsIndex, setFileDetailsIndex } =
		useFileStagingContext();

	return (
		<div className="flex flex-col flex-1 md:border-r border-r-neutral-weak md:max-w-[240px]">
			<div className="px-4 py-6 md:border-b border-neutral-weak title-3 text-neutral shrink-0">
				Materijali
			</div>

			<div
				className={cn(
					'flex flex-row md:flex-col gap-2 md:gap-2 flex-1 px-3 md:px-2 py-2 min-w-[200px] overflow-y-auto'
				)}
			>
				{files.map((file, index) => (
					<SidebarFile
						file={file}
						selected={fileDetailsIndex === index}
						onClick={() => setFileDetailsIndex(index)}
						onRemove={() => removeFile(index)}
						key={index}
					/>
				))}
			</div>
		</div>
	);
};
