'use client';

import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { useFileStagingContext } from '@/modules/file/contexts/file-staging-provider';
import { useUploadDialog } from '@/modules/file/hooks/use-upload-dialog';

export const FileUploadSection = ({
	startUploading,
	uploadingInProgress
}: {
	startUploading: () => void;
	uploadingInProgress: boolean;
}) => {
	const { addFiles } = useFileStagingContext();

	const handleAddFiles = (files: File[]) => {
		addFiles(files, {
			openFileDetailsDialog: false
		});
	};

	const { openUploadDialog } = useUploadDialog(handleAddFiles);

	return (
		<ContentPadding>
			<Section
				title="4. Prenesi materijale"
				description={`Dovuci dokumente u popis dolje, dodaj kategoriju na svaki dokument i, ako ima smisla, dodaj akademsku godinu (npr. za ispite). Ako nedostaje neka kategorija javi mi se, pa ju dodamo!`}
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Button
						size="md"
						variant="solid-weak"
						rounded
						onClick={openUploadDialog}
					>
						Dodaj materijale
					</Button>
					<Button
						size="md"
						variant="solid"
						rounded
						onClick={startUploading}
						loading={uploadingInProgress}
					>
						Prenesi sve
					</Button>
				</div>
			</Section>
		</ContentPadding>
	);
};
