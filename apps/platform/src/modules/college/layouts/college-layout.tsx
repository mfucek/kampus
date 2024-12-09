import { Container } from '@/global/components/container';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Badge } from '@/lib/shadcn/ui/badge';
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
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					Fakultet
				</Badge>
			</div>
			<div className="display-3">{college.name}</div>
		</div>
	);
};

const CollegeHeaderSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					{' '.repeat(8)}
				</Badge>
				<Badge variant="tertiary" theme="neutral">
					{' '.repeat(5)}
				</Badge>
			</div>
			<div className="w-[96px] h-[20px] rounded-md bg-neutral-weak" />
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
			<Suspense fallback={<CollegeHeaderSkeleton />}>
				<CollegeHeader collegeSlug={params.collegeSlug} />
			</Suspense>
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Opca Rasprava</Tab>
				<Tab route={makeRoute('/programs')}>Smjerovi</Tab>
				<Tab route={makeRoute('/all-subjects')}>Svi predmeti</Tab>
				<Tab route={makeRoute('/all-staff')}>Svi nastavnici</Tab>
			</Tabs>
			<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
		</Container>
	);
};
