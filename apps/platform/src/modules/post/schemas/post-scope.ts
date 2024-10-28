import { z } from 'zod';

export const postScopeSchema = z.object({
	college: z
		.object({
			// slug: z.string().nullish(),
			id: z.string().nullish()
		})
		.nullish(),
	topic: z
		.object({
			// slug: z.string().nullish(),
			id: z.string().nullish()
		})
		.nullish(),
	replyToPost: z
		.object({
			id: z.string().nullish()
		})
		.nullish(),
	author: z
		.object({
			id: z.string().nullish()
		})
		.nullish()
});

export type TPostScope = z.infer<typeof postScopeSchema>;
