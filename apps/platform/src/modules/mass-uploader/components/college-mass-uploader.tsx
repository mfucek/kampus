'use client';

import { Divider } from '@/global/components/divider';
import { ListLayout } from '@/global/layouts/list-layout';
import { FileStagingProvider } from '@/modules/file/contexts/file-staging-provider';
import { useMassUploader } from '../hooks/use-mass-uploader';

import { ComposerBodyProvider } from '@/modules/composer/contexts/composer-body-provider';
import { ComposerControllerProvider } from '@/modules/composer/contexts/composer-controller-provider';
import { type SubjectListItem } from '@/modules/topic/subject/api/procedures/list';
import { useState } from 'react';
import {
	ComposerSection,
	composerSectionDefaultBody
} from './sections/composer-section';
import { FileListSection } from './sections/file-list';
import { FileUploadSection } from './sections/file-upload';
import { IntroSection } from './sections/intro';
import { SubjectSelectionSection } from './sections/subject-selection';

const DocumentUploader = () => {
	const { startUploading, uploadingInProgress } = useMassUploader();

	return (
		<>
			<FileUploadSection
				startUploading={startUploading}
				uploadingInProgress={uploadingInProgress}
			/>

			<FileListSection />
		</>
	);
};

export const MassUploader = ({
	collegeId,
	subjects
}: {
	collegeId: string;
	subjects: SubjectListItem[];
}) => {
	const [targetSubject, setTargetSubject] = useState<SubjectListItem | null>(
		null
	);

	const subjectsSorted = (subjects ?? []).sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<FileStagingProvider>
			<ComposerBodyProvider defaultBody={composerSectionDefaultBody}>
				<ListLayout size="lg">
					<IntroSection />

					<Divider />

					<SubjectSelectionSection
						subjects={subjectsSorted}
						subject={targetSubject}
						setSubject={setTargetSubject}
					/>

					{targetSubject && (
						<>
							<Divider />
							<ComposerSection />
						</>
					)}

					{targetSubject && (
						<>
							<Divider />
							<ComposerControllerProvider
								collegeId={collegeId}
								topicId={targetSubject.id}
							>
								<DocumentUploader />
							</ComposerControllerProvider>
						</>
					)}
				</ListLayout>
			</ComposerBodyProvider>
		</FileStagingProvider>
	);
};
