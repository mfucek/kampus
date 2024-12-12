'use client';

import { type FC, type ReactNode } from 'react';

import { ComposerBodyProvider } from '../contexts/composer-body-provider';
import { ComposerControllerProvider } from '../contexts/composer-controller-provider';
import { ComposerFilesProvider } from '../contexts/composer-files-provider';
export const ComposerProvider: FC<{
	children: ReactNode;
	collegeId: string;
	topicId?: string;
	replyToId?: string;
	enabled?: boolean;
}> = ({ children, collegeId, topicId, replyToId, enabled = true }) => {
	return (
		<ComposerControllerProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
			enabled={enabled}
		>
			<ComposerBodyProvider>
				<ComposerFilesProvider>{children}</ComposerFilesProvider>
			</ComposerBodyProvider>
		</ComposerControllerProvider>
	);
};
