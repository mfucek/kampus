import { z } from 'zod';

export const postScopeSchema = z.object({
	college: z.object({
		slug: z.string().nullish(),
		id: z.string().nullish()
	}),
	topic: z.object({
		slug: z.string().nullish(),
		id: z.string().nullish()
	})
});

export type TPostScope = z.infer<typeof postScopeSchema>;
