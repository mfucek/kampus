const caches = new Map<
	string,
	{
		expires: number;
		data: any;
	}
>();

export const checkCache = <T>(key: string) => {
	console.log('checking cache');
	console.log(key);

	console.log('cache contains:');
	for (const k of caches.keys()) {
		console.log(k);
	}

	if (!caches.has(key)) {
		console.log('cache miss');
		return null;
	}

	if (caches.get(key)!.expires < Date.now()) {
		console.log('cache expired');
		caches.delete(key);
		return null;
	}

	console.log('cache hit');
	return caches.get(key)!.data as T;
};

export const cacheResult = (key: string, data: unknown, expires: number) => {
	console.log('caching result');
	console.log(key);

	caches.set(key, {
		expires,
		data
	});

	console.log('cache size: ' + caches.size);
	console.log('cache contains:');
	for (const k of caches.keys()) {
		console.log(k);
	}
};

export const invalidateCache = (key: string) => {
	caches.delete(key);
};
