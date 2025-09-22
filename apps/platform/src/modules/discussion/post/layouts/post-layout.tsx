import { type FC, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';

interface LayoutProps {
	params: Promise<{
		postId: string;
	}>;
}

export const PostLayout: FC<LayoutProps & PropsWithChildren> = async ({
	children,
	params
}) => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			{children}
		</Container>
	);
};
