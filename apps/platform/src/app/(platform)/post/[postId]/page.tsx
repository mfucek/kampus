import type { FC } from 'react';

import { PostPage } from '@/modules/discussion/pages/post-page';

interface PageProps {
	params: {
		postId: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { postId } = params;

	return <PostPage postId={postId} />;
};

export default Page;
