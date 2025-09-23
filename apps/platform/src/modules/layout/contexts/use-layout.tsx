import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext,
	useState
} from 'react';

// Custom hook for localStorage with type safety
function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
	// Get from local storage then parse stored json or return initialValue
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Failed to load ${key} from localStorage:`, error);
			return initialValue;
		}
	});

	// Return a wrapped version of useState's setter function that persists the new value to localStorage
	const setValue: Dispatch<SetStateAction<T>> = (value) => {
		try {
			// Allow value to be a function so we have the same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.warn(`Failed to save ${key} to localStorage:`, error);
		}
	};

	return [storedValue, setValue];
}

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
	const [showBookmarks, setShowBookmarks] = useLocalStorage(
		'showBookmarks',
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
