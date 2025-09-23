// Helper function to safely access nested properties using dot notation
const getNestedValue = (obj: unknown, path: string): unknown => {
	return path.split('.').reduce((current, key) => {
		return current &&
			typeof current === 'object' &&
			current !== null &&
			key in current &&
			current[key as keyof typeof current] !== undefined
			? current[key as keyof typeof current]
			: undefined;
	}, obj);
};

// Type helper to extract all possible nested property paths as strings
type NestedKeyOf<T, K extends keyof T = keyof T> = K extends string | number
	? T[K] extends object
		? T[K] extends unknown[]
			? `${K}` // Don't go deeper into arrays
			: `${K}` | `${K}.${NestedKeyOf<T[K]>}`
		: `${K}`
	: never;

// Type helper to get the value type at a nested path
type NestedValue<T, K extends string> = K extends keyof T
	? T[K]
	: K extends `${infer P}.${infer S}`
		? P extends keyof T
			? T[P] extends object
				? NestedValue<T[P], S>
				: never
			: never
		: never;

// Type helper to ensure the nested value is groupable (string, number, or arrays of them)
type GroupableNestedKeys<T> = {
	[K in NestedKeyOf<T>]: NestedValue<T, K> extends
		| string
		| string[]
		| number
		| number[]
		| undefined
		| null
		? K
		: never;
}[NestedKeyOf<T>];

export const groupByKey = <T>(
	data: T[],
	key: GroupableNestedKeys<T>,
	defaultGroup: string
) => {
	const grouped: Record<string, T[]> = {};

	for (const item of data) {
		const value = getNestedValue(item, key);

		const isEmpty =
			value === '' ||
			value === null ||
			value === undefined ||
			(Array.isArray(value) && value.length === 0);

		const sanitizedKey = isEmpty ? defaultGroup : value;

		const groupedKeys = Array.isArray(sanitizedKey)
			? sanitizedKey
			: [sanitizedKey];

		for (const group of groupedKeys as (string | number)[]) {
			if (!grouped[group]) {
				grouped[group] = [];
			}

			grouped[group].push(item);
		}
	}

	return grouped;
};

// Grouping by tag example
// const example_1 = groupByKey(
// 	[
// 		{
// 			tag: 'frontend',
// 			title: 'Full stack project #1'
// 		},
// 		{
// 			tag: 'backend',
// 			title: 'Project #2'
// 		}
// 	],
// 	'tag',
// 	'No Tag'
// );
// {
// 	"frontend": [
// 		{ tag: 'frontend', title: 'Full stack project #1' }
// 	],
// 	"backend": [
// 		{ tag: 'backend', title: 'Project #2' }
// 	]
// }

// Grouping by tags example
// const example_2 = groupByKey(
// 	[
// 		{ tags: ['frontend', 'backend'], title: 'Full stack project #1' },
// 		{ tags: [], title: 'Full stack project #2' }
// 	],
// 	'tags',
// 	'No Tags'
// );
// {
// 	"frontend": [
// 		{ tags: ['frontend', 'backend'], title: 'Full stack project #1' }
// 	],
// 	"backend": [
// 		{ tags: ['frontend', 'backend'], title: 'Full stack project #1' }
// 	],
// 	"No Tags": [{ tags: [], title: 'Full stack project #2' }]
// }

// Mixed example
// const example_3 = groupByKey(
// 	[
// 		{ tags: ['frontend', 'react'], title: 'React Dashboard' },
// 		{ tags: ['backend', 'node'], title: 'API Server' },
// 		{ tags: ['frontend', 'vue'], title: 'Vue App' }
// 	],
// 	'tags',
// 	'No Tags'
// );
// {
// 	"frontend": [
// 		{ tags: ['frontend', 'react'], title: 'React Dashboard' },
// 		{ tags: ['frontend', 'vue'], title: 'Vue App' }
// 	],
// 	"react": [
// 		{ tags: ['frontend', 'react'], title: 'React Dashboard' }
// 	],
// 	"backend": [
// 		{ tags: ['backend', 'node'], title: 'API Server' }
// 	],
// 	"node": [
// 		{ tags: ['backend', 'node'], title: 'API Server' }
// 	],
// 	"vue": [
// 		{ tags: ['frontend', 'vue'], title: 'Vue App' }
// 	]
// }
