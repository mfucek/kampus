import { DocumentFileType } from '@prisma/client';

export const mainCategories: DocumentFileType[] = [
	'EXAM',
	'COLOQUIUM',
	'LAB_EXERCISE',
	'EXERCISES',
	'HOMEWORK',
	'SEMINAR',
	'SCRIPT',
	'NOTES',
	'PAPER',
	'OTHER'
];

export const coloquiumCategories: DocumentFileType[] = [
	'COLOQUIUM_MID',
	'COLOQUIUM_FINAL',
	'SOLVED'
] as const;

export const examCategories: DocumentFileType[] = [
	'SUMMER_EXAM',
	'FALL_EXAM',
	'WINTER_EXAM',
	'SPRING_EXAM',
	'CORRECTION_EXAM',
	'ORAL_EXAM',
	'DEAN_EXAM',
	'SOLVED'
] as const;

export const subCategories: Record<DocumentFileType, DocumentFileType[]> = {
	EXAM: examCategories,
	COLOQUIUM: coloquiumCategories,
	LAB_EXERCISE: ['SOLVED'],
	HOMEWORK: ['SOLVED'],
	EXERCISES: ['SOLVED'],
	COLOQUIUM_MID: [],
	COLOQUIUM_FINAL: [],
	SEMINAR: [],
	SCRIPT: [],
	NOTES: [],
	PAPER: [],
	OTHER: [],
	SUMMER_EXAM: [],
	FALL_EXAM: [],
	WINTER_EXAM: [],
	SPRING_EXAM: [],
	DEAN_EXAM: [],
	CORRECTION_EXAM: [],
	ENTRANCE_EXAM: [],
	EXIT_EXAM: [],
	ORAL_EXAM: [],
	SOLVED: []
};

export const categoryParents: Record<DocumentFileType, DocumentFileType[]> =
	Object.values(DocumentFileType).reduce(
		(acc, category) => {
			acc[category] = [];
			return acc;
		},
		{} as Record<DocumentFileType, DocumentFileType[]>
	);

for (const [parent, children] of Object.entries(subCategories)) {
	for (const child of children) {
		categoryParents[child].push(parent as DocumentFileType);
	}
}
