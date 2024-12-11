import { CacheHelperClient } from './cache-helper-client';

export const CacheHelper = () => {
	const time = Date.now();

	return <CacheHelperClient time={time} />;
};
