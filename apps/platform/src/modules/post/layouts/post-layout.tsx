import { Suspense, type FC, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Spinner } from '@/global/components/spinner';

interface LayoutProps {
	params: Promise<{
		postId: string;
	}>;
}

export const PostLayout: FC<LayoutProps & PropsWithChildren> = async ({
	children,
	params
}) => {
	const { postId } = await params;

	const post = await api.post.getPostById({
		postId
	});

	const college = await api.college.getById({
		collegeId: post.post.collegeId
	});

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={college.name} tags={['Fakultet']} />

			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
