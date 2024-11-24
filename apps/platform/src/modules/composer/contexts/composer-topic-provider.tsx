'use client';

import { createContext, FC, ReactNode, useContext } from 'react';

const defaultData = {};

const ComposerTopicContext = createContext<{
	collegeId?: string;
	topicId?: string;
	replyToId?: string;
}>({
	...defaultData
});

export const useComposerTopicContext = () => {
	const context = useContext(ComposerTopicContext);

	if (!context) {
		throw new Error('useComposer must be used within a ComposerTopicProvider');
	}

	return context;
};

export const ComposerTopicProvider: FC<{
	children: ReactNode;
	collegeId?: string;
	topicId?: string;
	replyToId?: string;
}> = ({ children, collegeId, topicId, replyToId }) => {
	return (
		<ComposerTopicContext.Provider
			value={{
				collegeId,
				topicId,
				replyToId
			}}
		>
			{children}
		</ComposerTopicContext.Provider>
	);
};
