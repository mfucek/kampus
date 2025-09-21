// Helper function to safely access nested properties using dot notation
const getNestedValue = (obj: any, path: string): any => {
	return path.split('.').reduce((current, key) => {
		return current && current[key] !== undefined ? current[key] : undefined;
	}, obj);
};

// Type helper to extract all possible nested property paths as strings
type NestedKeyOf<T, K extends keyof T = keyof T> = K extends string | number
	? T[K] extends object
		? T[K] extends any[]
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

const ex1 = groupByKey(
	[
		{
			department: 'Department 1',
			value: 'Something'
		}
	],
	'department',
	'Default Department'
);

const ex2 = groupByKey(
	[
		{
			department: {
				name: 'Department 1'
			},
			value: 'Something'
		}
	],
	'department.name',
	'Default Department'
);
