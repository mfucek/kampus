import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActions } from '../post/actions/post-actions';
import {
	PostDiscussionAction,
	PostDiscussionActionSkeleton
} from '../post/actions/post-discussion-action';
import {
	PostReactionAction,
	PostReactionActionSkeleton
} from '../post/actions/post-reaction-action';
import { PostBody, PostBodySkeleton } from '../post/post-body';
import { PostDocuments } from '../post/post-documents';
import {
	PostHeaderSmall,
	PostHeaderSmallSkeleton
} from '../post/post-header-small';

export const TopLevelPost: FC<{ post: PostListByTopicIdItem }> = ({ post }) => {
	return (
		<div className="flex flex-col gap-2 p-4 border border-neutral-medium rounded-xl">
			<PostHeaderSmall post={post} />

			{post.post.body && <PostBody body={post.post.body} />}

			{post.documents && <PostDocuments documents={post.documents} />}

			<PostActions>
				<PostReactionAction reactions={post.reactions} postId={post.post.id} />
				<PostDiscussionAction post={post} />
			</PostActions>
		</div>
	);
};

export const TopLevelPostSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 p-4 border border-neutral-medium rounded-xl">
			<PostHeaderSmallSkeleton />

			<PostBodySkeleton />

			<PostActions>
				<PostReactionActionSkeleton />
				<PostDiscussionActionSkeleton />
			</PostActions>
		</div>
	);
};
