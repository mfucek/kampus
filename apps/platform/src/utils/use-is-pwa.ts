'use client';

import { useEffect, useState } from 'react';

export const useIsPWA = () => {
	const [isPWA, setIsPWA] = useState(false);

	useEffect(() => {
		setIsPWA(
			typeof window !== 'undefined' &&
				window.matchMedia('(display-mode: standalone)').matches
		);
	}, []);

	return { isPWA };
};
