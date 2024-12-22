'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/lib/shadcn/ui/input';
import { type College } from '@prisma/client';

import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { CollegeCard } from './college-card';

export const CollegeGrid = ({ colleges }: { colleges: College[] }) => {
	const [search, setSearch] = useState('');

	return (
		<>
			<div className="flex flex-col items-center gap-10">
				<Container size="sm">
					<ContentPadding size="sm">
						<h3 className="title-1 text-center mt-10">Koji faks tražiš?</h3>
					</ContentPadding>

					<ContentPadding size="sm">
						<Input
							type="text"
							placeholder="Unesi fakultet"
							className="text-center"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</ContentPadding>
				</Container>

				<Container>
					<ContentPadding size="sm">
						<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2">
							{colleges
								.filter(
									(college) =>
										college.name.toLowerCase().includes(search.toLowerCase()) ||
										college.slug.toLowerCase().includes(search.toLowerCase())
								)
								.map((college) => (
									<Link href={`/${college.slug}`} key={college.slug}>
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
