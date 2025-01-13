import { FullPost } from './full-post';

export type RecursivePost = FullPost & {
	replies: RecursivePost[];
};
