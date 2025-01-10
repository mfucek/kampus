'use client';

import { useEffect, useRef, useState } from 'react';

import { useToast } from '@/lib/shadcn/ui/use-toast';
import { useComposerController } from '@/modules/composer/contexts/composer-controller-provider';
import { useSubmitPost } from '@/modules/composer/hooks/use-submit-post';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/constants/category-labels';
import {
	type StagedFile,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';

export const useMassUploader = () => {
	const { files, setFiles } = useFileStagingContext();
	const { topicId } = useComposerController();
	const { handleSubmit } = useSubmitPost();

	const { toast } = useToast();

	const [uploadingInProgress, setUploadingInProgress] = useState(false);
	const startUploading = () => {
		setUploadingInProgress(true);
	};

	const stopUploading = () => {
		setUploadingInProgress(false);
	};

	const isCancelledRef = useRef(false);
	const uploadInProgressRef = useRef(false);

	useEffect(() => {
		const uploadFiles = async () => {
			if (!topicId) {
				toast({
					title: 'Nije odabran predmet',
					variant: 'danger'
				});
				stopUploading();
				return;
			}

			if (files.length === 0) {
				toast({
					title: 'Nema datoteka za upload',
					description: 'Dodaj barem jednu datoteku.'
				});
				stopUploading();
				return;
			}

			uploadInProgressRef.current = true; // Mark the upload as running
			for (const file of [...files]) {
				if (isCancelledRef.current || !uploadingInProgress) {
					toast({
						title: 'Upload prekinut',
						variant: 'default'
					});
					break;
				}

				if (file.documentOptions?.types.length === 0) {
					toast({
						title: 'Odaberi barem jednu kategoriju.',
						description: file.name,
						variant: 'danger'
					});
					break;
				}

				try {
					await publishFile(file);
				} catch (e: unknown) {
					toast({
						title: `Greška pri uploadanju datoteke: ${file.name}`,
						description: (e as Error).message,
						variant: 'danger'
					});
					break;
				}

				// Remove the uploaded file from the list
				setFiles((prevFiles: StagedFile[]) => prevFiles.slice(1));
			}
			uploadInProgressRef.current = false; // Mark upload as finished
			setUploadingInProgress(false);
		};

		// Start uploading if not already in progress and there are files to upload
		if (uploadingInProgress && !uploadInProgressRef.current) {
			isCancelledRef.current = false; // Reset cancellation state
			uploadFiles().catch((e: Error) =>
				toast({
					title: 'Greška pri uploadanju datoteka',
					description: e.message,
					variant: 'danger'
				})
			);
		}

		// Cleanup function: only cancel if not actively uploading
		return () => {
			if (!uploadInProgressRef.current) {
				isCancelledRef.current = true;
			}
		};
	}, [uploadingInProgress, files, setFiles]);

	const publishFile = async (file: StagedFile) => {
		const isSolved = file.documentOptions?.types.includes('SOLVED')
			? ' (ima rješenje i/ili postupak)'
			: '';

		const mainType = file.documentOptions?.types[0]
			? `${categoryLabels[file.documentOptions.types[0]]}`
			: '';

		const subTypes =
			file.documentOptions?.types && file.documentOptions?.types?.length > 1
				? file.documentOptions.types
						.slice(1)
						.filter((type) => type !== 'SOLVED')
				: [];

		const subTypesString =
			subTypes.length > 0
				? ` - ${subTypes.map((type) => categoryLabels[type].toLowerCase()).join(', ')}`
				: '';

		const year = file.documentOptions?.academicYear
			? ` (${file.documentOptions.academicYear})`
			: '';

		const text = `${mainType}${subTypesString}${year}${isSolved}`;

		const body = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: text
						}
					]
				}
			]
		};

		await handleSubmit({ bodyOverride: body, filesOverride: [file] });

		toast({
			title: 'Materijal objavljen',
			description: file.name,
			variant: 'success'
		});
	};

	return {
		uploadingInProgress,
		startUploading
	};
};
