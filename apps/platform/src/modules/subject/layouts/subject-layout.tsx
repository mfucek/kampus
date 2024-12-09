import { Suspense, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { Badge } from '@/lib/shadcn/ui/badge';
import { api } from '@/lib/trpc/server';

interface SubjectLayoutProps {
	params: {
		subjectSlug: string;
		collegeSlug: string;
	};
}

const SubjectHeader = async ({
	subjectSlug,
	collegeSlug
}: {
	subjectSlug: string;
	collegeSlug: string;
}) => {
	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					Predmet
				</Badge>
			</div>
			<div className="display-3">{subject.name}</div>
		</div>
	);
};

const SubjectHeaderSkeleton = () => {
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

export const SubjectLayout = async ({
	children,
	params
}: PropsWithChildren<SubjectLayoutProps>) => {
	const makeRoute = (page: string) =>
		`/${params.collegeSlug}/subject/${params.subjectSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<Suspense fallback={<SubjectHeaderSkeleton />}>
				<SubjectHeader
					subjectSlug={params.subjectSlug}
					collegeSlug={params.collegeSlug}
				/>
			</Suspense>
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Rasprava</Tab>
				<Tab route={makeRoute('/materials')}>Materijali</Tab>
				<Tab route={makeRoute('/staff')}>Nastavnici</Tab>
			</Tabs>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
