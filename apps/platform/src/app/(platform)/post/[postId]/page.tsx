import type { FC } from 'react';

import { PostPage } from '@/modules/discussion/pages/post-page';

interface PageProps {
	params: {
		postId: string;
	};
}

const Page: FC<PageProps> = async props => {
    const params = await props.params;
    const { postId } = params;

    return <PostPage postId={postId} />;
};

export default Page;
