'use client';

import { formatDistance } from 'date-fns';

export const CacheHelperClient = ({ time }: { time: number }) => {
	const formattedTime = formatDistance(new Date(time), new Date(), {
		addSuffix: true
	});

	return <div>CacheHelperClient: {formattedTime}</div>;
};
