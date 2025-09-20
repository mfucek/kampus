import { type FC, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';

interface LayoutProps {
	params: Promise<{
		generalTopicSlug: string;
	}>;
}

export const GeneralTopicLayout: FC<LayoutProps & PropsWithChildren> = async ({
	children,
	params
}) => {
	const { generalTopicSlug } = await params;

	const generalTopic = await api.topic.general.getBySlug({
		generalTopicSlug
	});

	return (
		<Container className="flex flex-col gap-10 pt-6 md:pt-10 pb-20">
			<PageHeader title={generalTopic.name} tags={['Generalni topic']} />

			{children}
		</Container>
	);
};
