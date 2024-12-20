'use client';

import { useFileStagingContext } from '../../file/contexts/file-staging-provider';
import { ComposerFile } from './composer-file';

export const ComposerFiles = () => {
	const { files, removeFile } = useFileStagingContext();
	const { openFileDetailsDialog } = useFileStagingContext();

	return (
		<div>
			<div className="flex flex-row overflow-x-auto gap-2">
				{files.map((file, index) => (
					<ComposerFile
						file={file}
						onRemove={() => removeFile(index)}
						onClick={() => openFileDetailsDialog(index)}
						key={index}
					/>
				))}
			</div>
		</div>
	);
};
