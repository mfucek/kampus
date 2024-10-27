import { z } from 'zod';

export const staffFiltersSchema = z.object({
	name: z.string().nullish(),
	subject: z.string().nullish()
});

export type TStaffFilters = z.infer<typeof staffFiltersSchema>;
