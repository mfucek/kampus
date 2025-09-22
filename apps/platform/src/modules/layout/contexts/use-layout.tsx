import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext,
	useState
} from 'react';

interface LayoutContextType {
	postId: string | null;
	setPostId: Dispatch<SetStateAction<string | null>>;
	showBookmarks: boolean;
	setShowBookmarks: Dispatch<SetStateAction<boolean>>;
}

const defaultData: LayoutContextType = {
	postId: null,
	setPostId: () => {},
	showBookmarks: false,
	setShowBookmarks: () => {}
};

const layoutContext = createContext<LayoutContextType>({
	...defaultData
});

export const LayoutProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const [postId, setPostId] = useState<string | null>(defaultData.postId);
	const [showBookmarks, setShowBookmarks] = useState<boolean>(
		defaultData.showBookmarks
	);

	return (
		<layoutContext.Provider
			value={{ postId, setPostId, showBookmarks, setShowBookmarks }}
		>
			{children}
		</layoutContext.Provider>
	);
};

export const useLayout = () => {
	const context = useContext(layoutContext);

	if (!context) {
		throw new Error('useLayout must be used within a LayoutProvider');
	}

	return context;
};
