'use client';

import Link from 'next/link';

import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { type GeneralTopicsListItem } from '../../api/procedures/general-topic/list-all';
import { GeneralTopicCard } from './general-topic-card';

export const GeneralTopicsGrid = ({
	generalTopics
}: {
	generalTopics: GeneralTopicsListItem[];
}) => {
	return (
		<>
			<Container>
				<ContentPadding size="sm">
					<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2">
						{generalTopics.map((generalTopic) => (
							<Link
								href={`/general/${generalTopic.slug}`}
								key={generalTopic.slug}
							>
								<GeneralTopicCard generalTopic={generalTopic} />
							</Link>
						))}
					</div>
				</ContentPadding>
			</Container>
		</>
	);
};
