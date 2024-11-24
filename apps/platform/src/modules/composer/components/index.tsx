'use client';

import { type FC } from 'react';

import { ComposerProvider } from '../providers/composer-provider';
import { ComposerEditor } from './composer-editor';
import { ComposerFiles } from './composer-files';
import { ComposerFooter } from './composer-footer';

export const Composer: FC<{
	collegeId: string;
	topicId?: string;
	replyToId?: string;
}> = ({ collegeId, topicId, replyToId }) => {
	return (
		<ComposerProvider
			collegeId={collegeId}
			topicId={topicId}
			replyToId={replyToId}
		>
			<div className="flex flex-col gap-3 w-full">
				<ComposerEditor />
				<ComposerFiles />
				<ComposerFooter />
			</div>
		</ComposerProvider>
	);
};
