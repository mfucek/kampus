'use client';

import { useState } from 'react';

import { Divider } from '@/global/components/divider';
import { ListLayout } from '@/global/layouts/list-layout';
import { ComposerBodyProvider } from '@/modules/composer/contexts/composer-body-provider';
import { ComposerControllerProvider } from '@/modules/composer/contexts/composer-controller-provider';
import { FileStagingProvider } from '@/modules/file/contexts/file-staging-provider';
import { useMassUploader } from '../hooks/use-mass-uploader';
import {
	ComposerSection,
	composerSectionDefaultBody
} from './sections/composer-section';
import { FileListSection } from './sections/file-list';
import { FileUploadSection } from './sections/file-upload';
import { IntroSection } from './sections/intro';
import {
	type ISubject,
	SubjectSelectionSection
} from './sections/subject-selection';

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

export const MassUploader = ({ subjects }: { subjects: ISubject[] }) => {
	const [targetSubject, setTargetSubject] = useState<ISubject | null>(null);

	const subjectsSorted = (subjects ?? []).sort((a, b) =>
		a.topic.name.localeCompare(b.topic.name)
	);

	return (
		<FileStagingProvider>
			<ComposerBodyProvider defaultBody={composerSectionDefaultBody}>
				<ListLayout size="lg">
					<IntroSection />

					<Divider />

					<SubjectSelectionSection
						subjects={subjectsSorted}
						selectedSubject={targetSubject}
						setSelectedSubject={setTargetSubject}
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
							<ComposerControllerProvider topicId={targetSubject.topic.id}>
								<DocumentUploader />
							</ComposerControllerProvider>
						</>
					)}
				</ListLayout>
			</ComposerBodyProvider>
		</FileStagingProvider>
	);
};
