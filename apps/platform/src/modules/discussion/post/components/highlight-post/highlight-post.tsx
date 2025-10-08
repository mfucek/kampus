import { type FC } from 'react';

import { type PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActions } from '../post/actions/post-actions';
import {
	PostReactionAction,
	PostReactionActionSkeleton
} from '../post/actions/post-reaction-action';
import { PostBody, PostBodySkeleton } from '../post/post-body';
import { PostDeletedBody } from '../post/post-deleted-body';
import { PostDocuments } from '../post/post-documents';
import { PostHeader } from '../post/post-header';
import { PostHeaderSmallSkeleton } from '../post/post-header-small';

export const HighlightPost: FC<{ post: PostListByTopicIdItem }> = ({
	post
}) => {
	return (
		<div className="flex flex-col gap-2">
			<PostHeader post={post} />

			{post.post.body && <PostBody body={post.post.body} />}
			{!post.post.body && <PostDeletedBody />}

			{post.documents && <PostDocuments documents={post.documents} />}

			<PostActions>
				<PostReactionAction reactions={post.reactions} postId={post.post.id} />
			</PostActions>
		</div>
	);
};

export const HighlightPostSkeleton = () => {
	return (
		<div className="flex flex-col gap-2">
			<PostHeaderSmallSkeleton />

			<PostBodySkeleton />

			<PostActions>
				<PostReactionActionSkeleton />
			</PostActions>
		</div>
	);
};
