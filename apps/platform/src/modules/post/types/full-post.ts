import { type JSONContent } from '@tiptap/react';

import { type DocumentFileType, type VoteType } from '@prisma/client';

export type FullPost = {
	post: {
		id: string;
		body: JSONContent | null;
		createdAt: Date;
		updatedAt: Date;
		authorId: string;
		collegeId: string;
		topicId: string | null;
		replyToId: string | null;
		author: {
			id: string;
			name: string;
			imageUrl: string | null;
			badge: string | null;
		};
		_count: {
			replies: number;
		};
	};
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
	documentFiles: {
		fileId: string;
		contentType: string;
		size: number;
		key: string;
		academicYear: string | null;
		title: string | null;
		types: DocumentFileType[];
		url?: string | null;
	}[];
};
