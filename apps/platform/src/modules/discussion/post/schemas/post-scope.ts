import { z } from 'zod';

export const postScopeSchema = z.object({
	topicId: z.string().nullish(),
	replyToPostId: z.string().nullish(),
	authorId: z.string().nullish()
});

export type TPostScope = z.infer<typeof postScopeSchema>;
