'use client';

import {
	createContext,
	type FC,
	type ReactNode,
	useContext,
	useState
} from 'react';

const defaultData = {
	collegeId: '',
	locked: false
};

const ComposerControllerContext = createContext<{
	collegeId: string;
	topicId?: string;
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
	collegeId: string;
	topicId?: string;
	replyToId?: string;
	enabled?: boolean;
}> = ({ children, collegeId, topicId, replyToId, enabled = true }) => {
	const [locked, setLocked] = useState(!enabled);

	return (
		<ComposerControllerContext.Provider
			value={{
				collegeId,
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
