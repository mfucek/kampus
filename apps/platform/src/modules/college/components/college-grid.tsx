'use client';

import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/react';
import Link from 'next/link';
import { useState } from 'react';
import { CollegeCard } from './college-card';

export const CollegeGrid = () => {
	const { data, isLoading } = api.college.listAll.useQuery();

	const [search, setSearch] = useState('');

	return (
		<Container>
			<div className="py-10 text-center">
				<h3>Koji faks trazis?</h3>
				<input
					type="text"
					placeholder="Unesi fakultet"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
				{data
					?.filter(
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
