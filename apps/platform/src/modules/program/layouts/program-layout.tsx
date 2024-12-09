import { Suspense, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { Badge } from '@/lib/shadcn/ui/badge';
import { api } from '@/lib/trpc/server';

interface ProgramLayoutProps {
	params: {
		collegeSlug: string;
		programSlug: string;
	};
}

const ProgramHeader = async ({
	collegeSlug,
	programSlug
}: {
	collegeSlug: string;
	programSlug: string;
}) => {
	const program = await api.program.getBySlug({
		collegeSlug,
		programSlug
	});

	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					Smjer
				</Badge>
			</div>
			<div className="display-3">{program.name}</div>
		</div>
	);
};

const ProgramHeaderSkeleton = () => {
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

export const ProgramLayout = async ({
	children,
	params
}: PropsWithChildren<ProgramLayoutProps>) => {
	const makeRoute = (page: string) =>
		`/${params.collegeSlug}/program/${params.programSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<Suspense fallback={<ProgramHeaderSkeleton />}>
				<ProgramHeader
					collegeSlug={params.collegeSlug}
					programSlug={params.programSlug}
				/>
			</Suspense>
			<Tabs className="px-4 lg:px-0">
				<Tab route={makeRoute('')}>Rasprava</Tab>
				<Tab route={makeRoute('/subjects')}>Predmeti</Tab>
			</Tabs>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
