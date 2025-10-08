import { type FC, useState } from 'react';

import { Composer } from '@/modules/composer/components';
import { type PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActions } from '../post/actions/post-actions';
import {
	PostReactionAction,
	PostReactionActionSkeleton
} from '../post/actions/post-reaction-action';
import {
	PostReplyAction,
	PostReplyActionSkeleton
} from '../post/actions/post-reply-action';
import { PostBody, PostBodySkeleton } from '../post/post-body';
import { PostDeletedBody } from '../post/post-deleted-body';
import { PostDocuments } from '../post/post-documents';
import {
	PostHeaderSmall,
	PostHeaderSmallSkeleton
} from '../post/post-header-small';
import { ReplyLoader } from './reply-loader';

export const Reply: FC<{ post: PostListByTopicIdItem; depth?: number }> = ({
	post,
	depth = 0
}) => {
	const hasReplies = post.repliesCount > 0;

	const [showReplies, _setShowReplies] = useState(depth <= 2);
	const [showComposer, setShowComposer] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-2 pb-6">
				<PostHeaderSmall post={post} />

				{post.post.body && <PostBody body={post.post.body} />}
				{!post.post.body && <PostDeletedBody />}

				{post.documents && <PostDocuments documents={post.documents} />}

				<PostActions>
					<PostReactionAction
						reactions={post.reactions}
						postId={post.post.id}
					/>
					<PostReplyAction
						onClick={() => setShowComposer((prev) => !prev)}
						selected={showComposer}
					/>
				</PostActions>
			</div>

			{showComposer && (
				<Composer replyToId={post.post.id} topicId={post.post.topicId} />
			)}

			{hasReplies && (
				<ReplyLoader post={post} defaultLoadingEnabled={showReplies} />
			)}
		</div>
	);
};

export const ReplySkeleton = () => {
	return (
		<div className="flex flex-col gap-2 pb-6">
			<PostHeaderSmallSkeleton />

			<PostBodySkeleton />

			<PostActions>
				<PostReactionActionSkeleton />
				<PostReplyActionSkeleton />
			</PostActions>
		</div>
	);
};
