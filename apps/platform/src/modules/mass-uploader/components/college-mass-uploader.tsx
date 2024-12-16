'use client';

import { Divider } from '@/global/components/divider';
import { ListLayout } from '@/global/layouts/list';
import { FileStagingProvider } from '@/modules/file/contexts/file-staging-provider';
import { useMassUploader } from '../hooks';

import { FileListSection } from './sections/file-list';
import { FileUploadSection } from './sections/file-upload';
import { IntroSection } from './sections/intro';
import { SubjectSelectionSection } from './sections/subject-selection';

export const CollegeMassUploader = ({ collegeId }: { collegeId: string }) => {
	return (
		<FileStagingProvider>
			<MassUploader collegeId={collegeId} />
		</FileStagingProvider>
	);
};

export const MassUploader = ({ collegeId }: { collegeId: string }) => {
	const {
		subjects,
		targetSubject,
		setTargetSubject,
		startUploading,
		uploadingInProgress
	} = useMassUploader(collegeId);

	return (
		<ListLayout size="lg">
			<IntroSection />

			<Divider />

			<SubjectSelectionSection
				subjects={subjects}
				subject={targetSubject}
				setSubject={setTargetSubject}
			/>

			<Divider />

			<FileUploadSection
				startUploading={startUploading}
				uploadingInProgress={uploadingInProgress}
			/>

			<FileListSection />
		</ListLayout>
	);
};
