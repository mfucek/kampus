'use client';

import { FC, ReactNode } from 'react';
import { ComposerBodyProvider } from '../contexts/composer-body-provider';
import { ComposerControllerProvider } from '../contexts/composer-controller-provider';
import { ComposerFilesProvider } from '../contexts/composer-files-provider';
export const ComposerProvider: FC<{
	children: ReactNode;
	collegeId: string;
	topicId?: string;
	replyToId?: string;
}> = ({ children, collegeId, topicId, replyToId }) => {
	return (
		<ComposerControllerProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
		>
			<ComposerBodyProvider>
				<ComposerFilesProvider>{children}</ComposerFilesProvider>
			</ComposerBodyProvider>
		</ComposerControllerProvider>
	);
};
