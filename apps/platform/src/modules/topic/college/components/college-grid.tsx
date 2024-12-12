'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/lib/shadcn/ui/input';
import { type College } from '@prisma/client';

import { Container } from '@/global/components/container';
import { CollegeCard } from './college-card';

export const CollegeGrid = ({ colleges }: { colleges: College[] }) => {
	const [search, setSearch] = useState('');

	return (
		<Container>
			<div className="py-10 text-center px-4 lg:px-0">
				<h3 className="mb-10 title-1">Koji faks tražiš?</h3>
				<Input
					type="text"
					placeholder="Unesi fakultet"
					className="text-center"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2 px-2 lg:px-0">
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
		</Container>
	);
};
