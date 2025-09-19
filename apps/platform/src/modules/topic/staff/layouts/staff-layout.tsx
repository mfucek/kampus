import { Suspense, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Spinner } from '@/global/components/spinner';

interface LayoutProps {
	params: Promise<{
		staffSlug: string;
		collegeSlug: string;
	}>;
}

export const StaffLayout = async ({
	children,
	params
}: PropsWithChildren<LayoutProps>) => {
	const { staffSlug, collegeSlug } = await params;

	const staff = await api.staff.getBySlug({
		staffSlug,
		collegeSlug
	});

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={staff.name} tags={['Nastavnik']} />
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
