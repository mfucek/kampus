import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { type FC } from 'react';
import { type StagedFile } from '../../file/contexts/file-staging-provider';
import { useComposerController } from '../contexts/composer-controller-provider';

export const ComposerFile: FC<{
	file: StagedFile;
	onRemove: () => void;
	onClick: () => void;
}> = ({ file, onRemove, onClick }) => {
	const { locked } = useComposerController();

	// const fileUrl = useMemo(() => {
	// 	return URL.createObjectURL(file.file);
	// }, [file]);

	return (
		<div
			className="flex flex-col w-[144px] h-[96px] grow-0 shrink-0 bg-neutral-weak rounded-xl clickable relative overflow-hidden items-center justify-center border border-neutral-weak group"
			onClick={!locked ? onClick : undefined}
		>
			<div className="flex h-full w-full items-center justify-center">
				{/* {file.type === 'IMAGE' && (
					<img
						src={fileUrl}
						alt={file.name}
						className="absolute inset-0 w-full h-full object-cover"
					/>
				)}

				{file.type === 'PDF' && (
					)} */}
				<>
					<Icon icon="file-textual" size={24} className="bg-neutral-strong" />
				</>
			</div>

			<div className="flex flex-row w-full p-2 bg-foreground">
				<p className="caption text-neutral">{file.name}</p>
			</div>

			{!locked && (
				<div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
