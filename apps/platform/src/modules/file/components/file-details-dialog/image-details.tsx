import { useFileStagingContext } from '../../../file/contexts/file-staging-provider';

export const ImageDetails = () => {
	const { files, fileDetailsIndex } = useFileStagingContext();

	const file = files[fileDetailsIndex ?? 0];
	const fileUrl = URL.createObjectURL(file!.file);

	return (
		<div className="flex flex-col flex-1 items-center justify-center min-h-[320px]">
			<div className="p-3">
				{file && file.type === 'IMAGE' && (
					<img
						src={fileUrl}
						alt={file.file.name}
						width={500}
						height={500}
						className="rounded-lg"
					/>
				)}
			</div>
		</div>
	);
};
