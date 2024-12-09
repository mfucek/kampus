import { Suspense, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { Spinner } from '@/global/components/spinner';
import { Badge } from '@/lib/shadcn/ui/badge';
import { api } from '@/lib/trpc/server';

interface StaffLayoutProps {
	params: {
		staffSlug: string;
		collegeSlug: string;
	};
}

const StaffHeader = async ({
	staffSlug,
	collegeSlug
}: {
	staffSlug: string;
	collegeSlug: string;
}) => {
	const staff = await api.staff.getBySlug({
		staffSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					Nastavnik
				</Badge>
			</div>
			<div className="display-3">{staff.name}</div>
		</div>
	);
};

const StaffHeaderSkeleton = () => {
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

export const StaffLayout = async ({
	children,
	params
}: PropsWithChildren<StaffLayoutProps>) => {
	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<Suspense fallback={<StaffHeaderSkeleton />}>
				<StaffHeader
					staffSlug={params.staffSlug}
					collegeSlug={params.collegeSlug}
				/>
			</Suspense>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
