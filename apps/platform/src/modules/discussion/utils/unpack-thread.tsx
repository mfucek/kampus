import { type FullPost, type RecursivePost } from '@/server/api/routers/post';

type UnpackedPost = FullPost & {
	depthInfo: number[];
};

export const unpackThread = (thread: RecursivePost): UnpackedPost[] => {
	const result: UnpackedPost[] = [];

	const traverse = (parent: RecursivePost, parentDepth: number[] = []) => {
		result.push({
			...parent,
			depthInfo: parentDepth
		});

		const replyCount = parent.replies.length;

		parent.replies.forEach((reply, index) => {
			const newDepth: number[] = [...parentDepth, replyCount - index - 1];
			traverse(reply, newDepth);
		});
	};

	traverse(thread, []);

	// remove root node
	result.shift();

	return result;
};
