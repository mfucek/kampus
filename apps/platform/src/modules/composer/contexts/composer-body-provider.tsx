'use client';

import { JSONContent } from '@tiptap/react';
import { createContext, FC, ReactNode, useContext, useState } from 'react';

const defaultData = {
	body: {
		type: 'doc',
		content: [{ type: 'paragraph', content: [] }]
	}
};

const ComposerBodyContext = createContext<{
	body: JSONContent;
	setBody: (body: JSONContent) => void;
}>({
	...defaultData,
	setBody: () => {}
});

export const useComposerBodyContext = () => {
	const context = useContext(ComposerBodyContext);

	if (!context) {
		throw new Error('useComposer must be used within a ComposerBodyProvider');
	}

	return context;
};

export const ComposerBodyProvider: FC<{
	children: ReactNode;
}> = ({ children }) => {
	const [body, setBody] = useState<JSONContent>(defaultData.body);

	return (
		<ComposerBodyContext.Provider
			value={{
				body,
				setBody
			}}
		>
			{children}
		</ComposerBodyContext.Provider>
	);
};
