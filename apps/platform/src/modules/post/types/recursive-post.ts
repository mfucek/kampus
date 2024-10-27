import { DocumentFileType, FileType, VoteType } from '@prisma/client';
import { JSONContent } from '@tiptap/core';

export type RecursivePost = {
	post: {
		id: string;
		body: JSONContent | null;
		createdAt: Date;
		authorId: string;
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
