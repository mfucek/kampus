'use client';

import {
	createContext,
	type FC,
	type ReactNode,
	useContext,
	useState
} from 'react';

const defaultData = {
	topicId: '',
	locked: false
};

const ComposerControllerContext = createContext<{
	topicId: string;
	replyToId?: string;
	locked: boolean;
	setLocked: (locked: boolean) => void;
}>({
	...defaultData,
	setLocked: () => {}
});

export const useComposerController = () => {
	const context = useContext(ComposerControllerContext);

	if (!context) {
		throw new Error(
			'useComposerController must be used within a ComposerControllerProvider'
		);
	}

	return context;
};

export const ComposerControllerProvider: FC<{
	children: ReactNode;
	topicId: string;
	replyToId?: string;
	enabled?: boolean;
}> = ({ children, topicId, replyToId, enabled = true }) => {
	const [locked, setLocked] = useState(!enabled);

	return (
		<ComposerControllerContext.Provider
			value={{
				topicId,
				replyToId,
				locked,
				setLocked
			}}
		>
			{children}
		</ComposerControllerContext.Provider>
	);
};
