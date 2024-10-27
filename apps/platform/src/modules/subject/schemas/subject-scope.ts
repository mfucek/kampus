import { z } from 'zod';

export const subjectScopeSchema = z.object({
	collegeSlug: z.string().nullish(),
	collegeId: z.string().nullish(),
	staffId: z.string().nullish()
});

export type TSubjectScope = z.infer<typeof subjectScopeSchema>;
