import { z } from 'zod';

export const staffScopeSchema = z.object({
	collegeSlug: z.string().nullish(),
	collegeId: z.string().nullish(),
	subjectId: z.string().nullish()
});

export type TStaffScope = z.infer<typeof staffScopeSchema>;
