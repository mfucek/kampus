'use client';

import { api } from '@/lib/trpc/react';
import { Container } from '@/modules/global/components/container';
import Link from 'next/link';
import { CollegeCard } from './college-card';

export const CollegeGrid = () => {
	const { data, isLoading } = api.college.hello.useQuery();

	return (
		<Container>
			<div className="py-10 text-center">
				<h3>Koji faks trazis?</h3>
				<input type="text" placeholder="Unesi fakultet" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
				{data?.map((college) => (
					<Link href={`/${college.slug}`} key={college.slug}>
						<CollegeCard college={college} />
					</Link>
				))}
			</div>
		</Container>
	);
};
