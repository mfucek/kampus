'use client';

import { FC, ReactNode } from 'react';
import { ComposerBodyProvider } from '../contexts/composer-body-provider';
import { ComposerFilesProvider } from '../contexts/composer-files-provider';
import { ComposerTopicProvider } from '../contexts/composer-topic-provider';
export const ComposerProvider: FC<{
	children: ReactNode;
	collegeId?: string;
	topicId?: string;
	replyToId?: string;
}> = ({ children, collegeId, topicId, replyToId }) => {
	return (
		<ComposerTopicProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
		>
			<ComposerBodyProvider>
				<ComposerFilesProvider>{children}</ComposerFilesProvider>
			</ComposerBodyProvider>
		</ComposerTopicProvider>
	);
};
