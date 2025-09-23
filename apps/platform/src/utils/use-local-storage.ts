import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

// Custom hook for localStorage with type safety
export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
	// Get from local storage then parse stored json or return initialValue
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const item = window.localStorage.getItem(key);
			setStoredValue(item ? JSON.parse(item) : initialValue);
		}
	}, [key]);

	// Return a wrapped version of useState's setter function that persists the new value to localStorage
	const setValue: Dispatch<SetStateAction<T>> = (value) => {
		const valueToStore = value instanceof Function ? value(storedValue) : value;
		setStoredValue(valueToStore);
		window.localStorage.setItem(key, JSON.stringify(valueToStore));
	};

	return [storedValue, setValue];
};
