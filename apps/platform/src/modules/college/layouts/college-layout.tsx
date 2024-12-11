import { Suspense, type FC, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { Badge } from '@/lib/shadcn/ui/badge';
import { api } from '@/lib/trpc/server';

interface LayoutProps {
	params: Promise<{
		collegeSlug: string;
	}>;
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
					<div className="w-20"></div>
				</Badge>
				<Badge variant="tertiary" theme="neutral">
					<div className="w-10"></div>
				</Badge>
			</div>
			<div className="w-40 h-[32px] rounded-md bg-neutral-medium" />
		</div>
	);
};

export const CollegeLayout: FC<LayoutProps & PropsWithChildren> = async ({
	children,
	params
}) => {
	const { collegeSlug } = await params;

	const makeRoute = (page: string) => `/${collegeSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<Suspense fallback={<CollegeHeaderSkeleton />}>
				<CollegeHeader collegeSlug={collegeSlug} />
			</Suspense>
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Opca Rasprava</Tab>
				<Tab route={makeRoute('/programs')}>Smjerovi</Tab>
				<Tab route={makeRoute('/all-subjects')}>Svi predmeti</Tab>
				<Tab route={makeRoute('/all-staff')}>Svi nastavnici</Tab>
			</Tabs>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
