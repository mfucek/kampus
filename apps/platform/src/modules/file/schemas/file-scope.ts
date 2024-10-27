import { z } from 'zod';

export const fileScopeSchema = z.object({
	collegeId: z.string().nullish(),
	topicId: z.string().nullish(),
	authorId: z.string().nullish(),
	postId: z.string().nullish()
});

export type TFileScope = z.infer<typeof fileScopeSchema>;
