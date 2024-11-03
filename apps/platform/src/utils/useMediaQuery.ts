import { useEffect, useState } from 'react';
export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (window && window.innerWidth < 768) {
			setIsMobile(true);
		}
	}, []);

	return { isMobile, isDesktop: !isMobile };
};
