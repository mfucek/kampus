import { type FC } from 'react';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { type PostListByTopicIdItem } from '../../../api/procedures/list-by-topic-id';

export const PostActionsList: FC<{ post: PostListByTopicIdItem }> = ({
	post
}) => {
	const { user } = useAuth();

	const isUserAuthor = user?.id === post.author.id;

	const handleShare = async () => {
		const sharedUrl = window.location.origin + '/post/' + post.post.id;

		// navigator.clipboard.writeText(window.location.href);
		if (navigator.canShare()) {
			await navigator.share({
				title: 'Podijeli ovu objavu',
				url: sharedUrl
			});
		} else {
			await navigator.clipboard.writeText(sharedUrl);
			toast.success('Link kopiran', {
				description: 'Možeš sada kopirati link gdje god želiš!'
			});
		}
	};

	const utils = api.useUtils();
	const deletePost = api.post.deletePost.useMutation();

	const handleDeletePost = async () => {
		await deletePost.mutateAsync({ postId: post.post.id });

		// invalidate replies cache
		if (post.post.replyToId) {
			await utils.post.listReplies.invalidate({ postId: post.post.replyToId });
		}

		// invalidate topic cache (replies counter on top-level posts)
		await utils.post.listByTopicId.invalidate();
	};

	return (
		<>
			<Button
				variant="ghost"
				theme="neutral"
				size="sm"
				className="justify-start"
				disabled
			>
				<Icon icon="edit" />
				Uredi
			</Button>

			<Button
				variant="ghost"
				theme="neutral"
				size="sm"
				className="justify-start"
				onClick={handleShare}
			>
				<Icon icon="share" />
				Podijeli
			</Button>

			<Link href={`/user/${post.author.id}`} className="w-full">
				<Button
					variant="ghost"
					theme="neutral"
					size="sm"
					className="justify-start w-full"
				>
					<Icon icon="user" />
					Vidi profil
				</Button>
			</Link>

			{isUserAuthor && (
				<Button
					variant="ghost"
					theme="danger"
					size="sm"
					className="justify-start"
					onClick={handleDeletePost}
				>
					<Icon icon="delete" />
					Obriši
				</Button>
			)}
		</>
	);
};
