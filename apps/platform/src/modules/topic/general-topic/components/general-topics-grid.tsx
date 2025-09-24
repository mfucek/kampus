'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { type GeneralTopicsListItem } from '../../api/procedures/general-topic/list-all';
import { GeneralTopicCard } from './general-topic-card';

export const GeneralTopicsGrid = ({
	generalTopics
}: {
	generalTopics: GeneralTopicsListItem[];
}) => {
	const [search, setSearch] = useState('');

	return (
		<>
			<div className="flex flex-col items-center gap-10">
				{/* <Container size="sm">
					<ContentPadding size="sm">
						<h3 className="title-1 text-neutral text-center mt-10">
							Koji generalni topic tražiš?
						</h3>
					</ContentPadding>

					<ContentPadding size="sm">
						<Input
							type="text"
							placeholder="Unesi generalni topic"
							className="text-center"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</ContentPadding>
				</Container> */}

				<Container>
					<ContentPadding size="sm">
						<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2">
							{generalTopics
								.filter(
									(generalTopic) =>
										generalTopic.name
											.toLowerCase()
											.includes(search.toLowerCase()) ||
										generalTopic.slug
											.toLowerCase()
											.includes(search.toLowerCase())
								)
								.map((generalTopic) => (
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
			</div>
		</>
	);
};
