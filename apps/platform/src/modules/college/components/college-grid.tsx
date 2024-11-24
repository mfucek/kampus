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
			<div className="py-10 text-center">
				<h3 className="mb-10">Koji faks tražiš?</h3>
				<Input
					type="text"
					placeholder="Unesi fakultet"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
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
		</Container>
	);
};
