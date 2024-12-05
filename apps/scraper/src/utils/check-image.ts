export const checkImage = async (url: string) => {
	const res = await fetch(url);
	const type = res.headers.get('content-type');

	return type?.startsWith('image/') ?? false;
};
