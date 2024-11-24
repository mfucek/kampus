'use client';

import { type JSONContent } from '@tiptap/react';
import {
	createContext,
	type FC,
	type ReactNode,
	useContext,
	useState
} from 'react';

const defaultData = {
	body: null,
	characterCount: 0
};

const ComposerBodyContext = createContext<{
	body: JSONContent | null;
	setBody: (body: JSONContent | null) => void;
	characterCount: number;
	setCharacterCount: (characterCount: number) => void;
}>({
	...defaultData,
	setBody: () => {},
	setCharacterCount: () => {}
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
	const [body, setBody] = useState<JSONContent | null>(defaultData.body);
	const [characterCount, setCharacterCount] = useState(
		defaultData.characterCount
	);

	return (
		<ComposerBodyContext.Provider
			value={{
				body,
				setBody,
				characterCount,
				setCharacterCount
			}}
		>
			{children}
		</ComposerBodyContext.Provider>
	);
};
