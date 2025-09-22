import { type FC, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';

export const PostLayout: FC<PropsWithChildren> = async ({ children }) => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			{children}
		</Container>
	);
};
