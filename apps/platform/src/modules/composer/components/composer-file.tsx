import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { type FC, useMemo } from 'react';
import { useComposerController } from '../contexts/composer-controller-provider';
import { type PostFile } from '../contexts/composer-files-provider';

export const ComposerFile: FC<{
	file: PostFile;
	onRemove: () => void;
	onClick: () => void;
}> = ({ file, onRemove, onClick }) => {
	const { locked } = useComposerController();

	const fileUrl = useMemo(() => {
		return URL.createObjectURL(file.file);
	}, [file]);

	return (
		<div
			className="flex flex-col w-[120px] h-[80px] grow-0 shrink-0 bg-neutral-weak rounded-xl clickable relative overflow-hidden items-center justify-center"
			onClick={!locked ? onClick : undefined}
		>
			{file.type === 'IMAGE' && (
				<img
					src={fileUrl}
					alt={file.name}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			)}

			{file.type === 'PDF' && (
				<>
					<Icon icon="file-textual" size={24} />
					<p className="caption text-neutral-strong">{file.name}</p>
				</>
			)}

			{!locked && (
				<div className="absolute top-0 right-0">
					<Button
						variant="ghost"
						iconOnly
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
					>
						<Icon icon="close" />
					</Button>
				</div>
			)}
		</div>
	);
};
