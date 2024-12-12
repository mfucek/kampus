'use client';

import { formatDistance } from 'date-fns';

export const CacheHelperClient = ({ time }: { time: number }) => {
	const formattedTime = formatDistance(new Date(time), new Date(), {
		addSuffix: true,
		includeSeconds: true
	});

	return (
		<div className="w-full body-3 text-neutral-strong text-center">
			Updated {formattedTime}
		</div>
	);
};
