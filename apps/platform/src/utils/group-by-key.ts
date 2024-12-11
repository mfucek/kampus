type StringOrStringArrayKeys<T> = {
	[K in keyof T]: T[K] extends
		| string
		| string[]
		| number
		| number[]
		| undefined
		| null
		? K
		: never;
}[keyof T];

export const groupByKey = <T>(
	data: T[],
	key: StringOrStringArrayKeys<T>,
	defaultGroup: string
) => {
	const grouped: Record<string, T[]> = {};

	console.log(data);

	for (const item of data) {
		const isEmpty =
			item[key] === '' ||
			item[key] === null ||
			item[key] === undefined ||
			(Array.isArray(item[key]) && item[key].length === 0);

		const sanitizedKey = isEmpty ? defaultGroup : item[key];

		const groupedKeys = Array.isArray(sanitizedKey)
			? sanitizedKey
			: [sanitizedKey];

		for (const group of groupedKeys) {
			if (!grouped[group]) {
				grouped[group] = [];
			}

			grouped[group].push(item);
		}
	}

	console.log(Object.keys(grouped));

	return grouped;
};
