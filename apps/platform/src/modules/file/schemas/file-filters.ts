import { DocumentFileType } from '@prisma/client';
import { z } from 'zod';

export const fileFiltersSchema = z.object({
	name: z.string().nullish(),
	documentTypes: z.array(z.nativeEnum(DocumentFileType)).nullish()
});

export type TFileFilters = z.infer<typeof fileFiltersSchema>;
