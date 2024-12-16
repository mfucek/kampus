'use client';

import { Divider } from '@/global/components/divider';
import { ListLayout } from '@/global/layouts/list-layout';
import { FileStagingProvider } from '@/modules/file/contexts/file-staging-provider';
import { useMassUploader } from '../hooks';

import { api } from '@/lib/trpc/react';
import { ComposerBodyProvider } from '@/modules/composer/contexts/composer-body-provider';
import { ComposerControllerProvider } from '@/modules/composer/contexts/composer-controller-provider';
import { type SubjectListItem } from '@/modules/topic/subject/api/procedures/list';
import { useState } from 'react';
import { FileListSection } from './sections/file-list';
import { FileUploadSection } from './sections/file-upload';
import { IntroSection } from './sections/intro';
import { SubjectSelectionSection } from './sections/subject-selection';

export const CollegeMassUploader = ({ collegeId }: { collegeId: string }) => {
	const [targetSubject, setTargetSubject] = useState<SubjectListItem | null>(
		null
	);

	const { data: subjects } = api.subject.list.useQuery({
		scope: {
			collegeId: collegeId
		}
	});

	const subjectsSorted = (subjects?.subjects ?? []).sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<FileStagingProvider>
			<ComposerBodyProvider>
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
							<ComposerControllerProvider
								collegeId={collegeId}
								topicId={targetSubject.id}
							>
								<MassUploader />
							</ComposerControllerProvider>
						</>
					)}
				</ListLayout>
			</ComposerBodyProvider>
		</FileStagingProvider>
	);
};

export const MassUploader = () => {
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
