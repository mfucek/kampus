'use client';

import Link from 'next/link';

import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { type CollegeGetItem } from '../../api/procedures/college/get-by-id';
import { CollegeCard } from './college-card';

export const CollegeGrid = ({ colleges }: { colleges: CollegeGetItem[] }) => {
	return (
		<>
			<Container>
				<ContentPadding size="sm">
					<div className="grid grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 gap-2">
						{colleges.map((college) => (
							<Link href={`/${college.topic.slug}`} key={college.topic.slug}>
								<CollegeCard college={college} />
							</Link>
						))}
					</div>
				</ContentPadding>
			</Container>
		</>
	);
};
