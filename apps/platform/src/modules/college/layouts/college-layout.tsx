import { Container } from '@/global/components/container';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { api } from '@/lib/trpc/server';
import { Suspense, type PropsWithChildren } from 'react';

interface CollegeLayoutProps {
	params: {
		collegeSlug: string;
	};
}

const CollegeHeader = async ({ collegeSlug }: { collegeSlug: string }) => {
	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<div>
			<div className="display-3">{college.name}</div>
		</div>
	);
};

export const CollegeLayout = async ({
	children,
	params
}: PropsWithChildren<CollegeLayoutProps>) => {
	const makeRoute = (page: string) => `/${params.collegeSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<Suspense fallback={<div>Loading...</div>}>
				<CollegeHeader collegeSlug={params.collegeSlug} />
			</Suspense>
			<Tabs>
				<Tab route={makeRoute('')}>Opca Rasprava</Tab>
				<Tab route={makeRoute('/programs')}>Smjerovi</Tab>
				<Tab route={makeRoute('/all-subjects')}>Svi predmeti</Tab>
				<Tab route={makeRoute('/all-staff')}>Svi nastavnici</Tab>
			</Tabs>
			<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
		</Container>
	);
};
