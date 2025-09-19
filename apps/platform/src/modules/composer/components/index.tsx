'use client';

import { type FC } from 'react';

import { useAuth } from '@/deps/better-auth/use-auth';
import { FileStagingProvider } from '@/modules/file/contexts/file-staging-provider';
import { ComposerBodyProvider } from '../contexts/composer-body-provider';
import { ComposerControllerProvider } from '../contexts/composer-controller-provider';
import { ComposerEditor } from './composer-editor';
import { ComposerFiles } from './composer-files';
import { ComposerFooter } from './composer-footer';
import { ComposerWrapper } from './composer-wrapper';

export const Composer: FC<{
	collegeId: string;
	topicId?: string;
	replyToId?: string;
	className?: string;
}> = ({ collegeId, topicId, replyToId, className }) => {
	const { isSignedIn } = useAuth();

	return (
		<ComposerControllerProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
			enabled={isSignedIn}
		>
			<FileStagingProvider>
				<ComposerBodyProvider>
					<ComposerWrapper className={className}>
						<ComposerEditor />
						<ComposerFiles />
						<ComposerFooter />
					</ComposerWrapper>
				</ComposerBodyProvider>
			</FileStagingProvider>
		</ComposerControllerProvider>
	);
};
