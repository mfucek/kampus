import { z } from 'zod';

export const subjectFiltersSchema = z.object({
	name: z.string().nullish()
	//
});

export type TSubjectFilters = z.infer<typeof subjectFiltersSchema>;
