import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
	threshold?: number;
	rootMargin?: string;
}

export const useIntersectionObserver = ({
	threshold = 0.1,
	rootMargin = '0px'
}: UseIntersectionObserverProps = {}) => {
	const [isInView, setIsInView] = useState(false);
	const elementRef = useRef<any>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsInView(entry?.isIntersecting ?? false);
			},
			{
				threshold,
				rootMargin
			}
		);

		observer.observe(element);

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [threshold, rootMargin, elementRef]);

	return { elementRef, isInView };
};
