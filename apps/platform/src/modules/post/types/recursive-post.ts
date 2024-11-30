import { type JSONContent } from '@tiptap/react';

import {
	type DocumentFileType,
	type FileType,
	type VoteType
} from '@prisma/client';

export type RecursivePost = {
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
			createdAt: Date;
			updatedAt: Date;
			displayName: string;
			imageUrl: string | null;
			accountId: string;
			badge: string | null;
		};
		_count: {
			replies: number;
		};
	};
	replies: RecursivePost[];
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
	files: {
		id: string;
		key: string;
		type: FileType;
		documentFile:
			| {
					academicYear?: string;
					title?: string;
					types: DocumentFileType[];
			  }
			| undefined
			| null;
		imageFile: {} | null;
		url?: string | null;
	}[];
};
