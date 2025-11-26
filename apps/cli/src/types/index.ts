import type { Logger } from '@/utils/logger';
import { z } from 'zod';

export const professorReferenceSchema = z.object({
	role: z.string(),
	link: z.string()
});

export type ProfessorReference = z.infer<typeof professorReferenceSchema>;

// -----------------------------

export const subjectSchema = z.object({
	externalLink: z.string(),
	name: z.string(),
	shortName: z.string().nullable(),
	externalCode: z.string().nullable(),
	ects: z.number().nullable(),
	professorsLinks: z.array(professorReferenceSchema)
});

export type Subject = z.infer<typeof subjectSchema>;

// -----------------------------

export const subjectReferenceSchema = z.object({
	externalLink: z.string(),
	semester: z.number(),
	groupName: z.string()
});

export type SubjectReference = z.infer<typeof subjectReferenceSchema>;

// -----------------------------

export const programSchema = z.object({
	externalLink: z.string(),
	name: z.string(),
	shortName: z.string(),
	departments: z.array(z.string()),
	subjects: z.array(subjectReferenceSchema),
	type: z.string() // preddiplomski, diplomski, doktorski, specijalisticki, etc.
});

export type Program = z.infer<typeof programSchema>;

// -----------------------------

export const professorSchema = z.object({
	externalLink: z.string(),
	name: z.string(),
	imageUrl: z.string().nullable()
});

export type Professor = z.infer<typeof professorSchema>;

// -----------------------------

export type DriverCallbacks = {
	onSubjectsScraped?: (subjects: Subject[]) => void;
	onProgramsScraped?: (programs: Program[]) => void;
	onProfessorsScraped?: (professors: Professor[]) => void;
	onProgress?: (progress: number, total: number, title?: string) => void;
	onCompleted?: () => void;
};

export type DriverOptions = {
	debug?: boolean;
	logger?: Logger;
	callbacks?: DriverCallbacks;
};
