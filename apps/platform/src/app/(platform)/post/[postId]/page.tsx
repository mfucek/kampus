import type { FC } from 'react';

import { PostPage } from '@/modules/discussion/pages/post-page';

interface PageProps {
	params: Promise<{
		postId: string;
	}>;
}

const Page: FC<PageProps> = async ({ params }) => {
	const { postId } = await params;

	return <PostPage postId={postId} />;
};

export default Page;
