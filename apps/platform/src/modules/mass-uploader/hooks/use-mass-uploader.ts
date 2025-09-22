'use client';

import { useEffect, useRef, useState } from 'react';

import { useComposerBodyContext } from '@/modules/composer/contexts/composer-body-provider';
import { useComposerController } from '@/modules/composer/contexts/composer-controller-provider';
import { useSubmitPost } from '@/modules/composer/hooks/use-submit-post';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/constants/category-labels';
import {
	type StagedFile,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';
import { toast } from 'sonner';
import { composerSectionDefaultBody } from '../components/sections/composer-section';

export const useMassUploader = () => {
	const { files, setFiles } = useFileStagingContext();
	const { topicId } = useComposerController();
	const { handleSubmit } = useSubmitPost();

	const { body: bodyFromContext } = useComposerBodyContext();

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
				toast.error('Nije odabran predmet');
				stopUploading();
				return;
			}

			if (files.length === 0) {
				toast.error('Nema datoteka za upload', {
					description: 'Dodaj barem jednu datoteku.'
				});
				stopUploading();
				return;
			}

			// Mark the upload as running
			uploadInProgressRef.current = true;

			// Create parent post
			const parentPost = await handleSubmit({
				// add body override so that the composer body is not reset after publishing
				bodyOverride: bodyFromContext ?? composerSectionDefaultBody,
				filesOverride: []
			});

			if (!parentPost) {
				toast.error('Dogodila se greška', {
					description: 'Greška pri kreaciji parent posta'
				});
				return;
			}

			for (const file of [...files]) {
				if (isCancelledRef.current || !uploadingInProgress) {
					toast.error('Upload prekinut', {
						description: 'Upload prekinut'
					});
					break;
				}

				if (file.documentOptions?.types.length === 0) {
					toast.error('Odaberi barem jednu kategoriju.', {
						description: file.name
					});
					break;
				}

				try {
					await publishFile(file, parentPost.id);
				} catch (e: unknown) {
					toast.error(`Greška pri uploadanju datoteke: ${file.name}`, {
						description: (e as Error).message
					});
					break;
				}

				// Remove the uploaded file from the list
				setFiles((prevFiles: StagedFile[]) => prevFiles.slice(1));
			}

			// Mark upload as finished
			uploadInProgressRef.current = false;
			setUploadingInProgress(false);
		};

		// Start uploading if not already in progress and there are files to upload
		if (uploadingInProgress && !uploadInProgressRef.current) {
			isCancelledRef.current = false; // Reset cancellation state
			uploadFiles().catch((e: Error) =>
				toast.error('Greška pri uploadanju datoteka', {
					description: e.message
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

	const publishFile = async (file: StagedFile, parentPostId: string) => {
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

		await handleSubmit({
			bodyOverride: body,
			filesOverride: [file],
			replyToIdOverride: parentPostId
		});

		toast.success('Materijal objavljen', {
			description: file.name
		});
	};

	return {
		uploadingInProgress,
		startUploading
	};
};
