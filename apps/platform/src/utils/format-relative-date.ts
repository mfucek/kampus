import { formatDistanceToNow } from 'date-fns';

export const formatRelativeDate = (date: Date | string | number): string => {
	const d =
		typeof date === 'string' || typeof date === 'number'
			? new Date(date)
			: date;
	return formatDistanceToNow(d, { addSuffix: true });
};
