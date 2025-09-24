'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { type CollegeGetItem } from '../../api/procedures/college/get-by-id';
import { CollegeCard } from './college-card';

export const CollegeGrid = ({ colleges }: { colleges: CollegeGetItem[] }) => {
	const [search, setSearch] = useState('');

	return (
		<>
			<div className="flex flex-col items-center gap-10">
				{/* <Container size="sm">
					<ContentPadding size="sm">
						<h3 className="title-1 text-neutral text-center mt-10">
							Koji faks tražiš?
						</h3>
					</ContentPadding>

					<ContentPadding size="sm">
						<Input
							type="text"
							placeholder="Unesi fakultet"
							className="text-center"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</ContentPadding>
				</Container> */}

				<Container>
					<ContentPadding size="sm">
						<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2">
							{colleges
								.filter(
									(college) =>
										college.topic.name
											.toLowerCase()
											.includes(search.toLowerCase()) ||
										college.topic.slug
											.toLowerCase()
											.includes(search.toLowerCase())
								)
								.map((college) => (
									<Link
										href={`/${college.topic.slug}`}
										key={college.topic.slug}
									>
										<CollegeCard college={college} />
									</Link>
								))}
						</div>
					</ContentPadding>
				</Container>
			</div>
		</>
	);
};
