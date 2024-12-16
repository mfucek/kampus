'use client';

import { useEffect, useRef, useState } from 'react';

import { api } from '@/lib/trpc/react';
import {
	type StagedFile,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';
import { type SubjectListItem } from '@/modules/topic/subject/api/procedures/list';

export const useMassUploader = (collegeId: string) => {
	const [targetSubject, setTargetSubject] = useState<SubjectListItem | null>(
		null
	);
	const { files, setFiles } = useFileStagingContext();

	const [uploadingInProgress, setUploadingInProgress] = useState(false);

	const { data: subjects } = api.subject.list.useQuery({
		scope: {
			collegeId: collegeId
		}
	});

	const subjectsSorted = (subjects?.subjects ?? []).sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	const startUploading = () => {
		setUploadingInProgress(true);
	};

	const isCancelledRef = useRef(false);
	const uploadInProgressRef = useRef(false);

	useEffect(() => {
		const uploadFiles = async () => {
			uploadInProgressRef.current = true; // Mark the upload as running
			for (const file of [...files]) {
				if (isCancelledRef.current || !uploadingInProgress) {
					console.log('Upload cancelled');
					break;
				}

				try {
					console.log(file);
					// Simulate file upload with a delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// Remove the uploaded file from the list
					setFiles((prevFiles: StagedFile[]) => prevFiles.slice(1));
					console.log('Upload successful');
				} catch (e) {
					console.error(`Error uploading file: ${file.name}`, e);
				}
			}
			uploadInProgressRef.current = false; // Mark upload as finished
			setUploadingInProgress(false);
		};

		// Start uploading if not already in progress and there are files to upload
		if (
			uploadingInProgress &&
			!uploadInProgressRef.current &&
			files.length > 0
		) {
			isCancelledRef.current = false; // Reset cancellation state
			uploadFiles().catch((e) => console.error('Error in upload process', e));
		}

		// Cleanup function: only cancel if not actively uploading
		return () => {
			if (!uploadInProgressRef.current) {
				isCancelledRef.current = true;
			}
		};
	}, [uploadingInProgress, files, setFiles]);

	return {
		subjects: subjectsSorted,
		targetSubject,
		setTargetSubject,
		uploadingInProgress,
		startUploading
	};
};
