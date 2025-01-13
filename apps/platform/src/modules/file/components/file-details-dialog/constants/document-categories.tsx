import { DocumentFileType } from '@prisma/client';

export const mainCategories: DocumentFileType[] = [
	'EXAM',
	'COLOQUIUM',
	'POP_EXAM',
	'LAB_EXERCISE',
	'EXERCISES',
	'HOMEWORK',
	'SEMINAR',
	'SCRIPT',
	'NOTES',
	'PAPER',
	'LECTURE',
	'PRESENTATION',
	'OTHER'
];

export const coloquiumSubCategories: DocumentFileType[] = [
	'COLOQUIUM_MID',
	'COLOQUIUM_FINAL',
	'COLOQUIUM_FIRST',
	'COLOQUIUM_SECOND',
	'COLOQUIUM_THIRD',
	'COLOQUIUM_FOURTH',
	'EXAM_THEORY',
	'EXAM_PROBLEMS',
	'SOLVED'
] as const;

export const examSubCategories: DocumentFileType[] = [
	'SUMMER_EXAM',
	'FALL_EXAM',
	'WINTER_EXAM',
	'SPRING_EXAM',
	'CORRECTION_EXAM',
	'ORAL_EXAM',
	'DEAN_EXAM',
	'ENTRANCE_EXAM',
	'EXIT_EXAM',
	'EXAM_THEORY',
	'EXAM_PROBLEMS',
	'SOLVED'
] as const;

export const subCategories: Record<DocumentFileType, DocumentFileType[]> = {
	EXAM: examSubCategories,
	COLOQUIUM: coloquiumSubCategories,
	POP_EXAM: ['SOLVED'],
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
	SOLVED: [],
	LECTURE: [],
	PRESENTATION: [],
	COLOQUIUM_FIRST: [],
	COLOQUIUM_SECOND: [],
	COLOQUIUM_THIRD: [],
	COLOQUIUM_FOURTH: [],
	EXAM_THEORY: [],
	EXAM_PROBLEMS: []
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
