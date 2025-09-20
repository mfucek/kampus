import { Suspense, type PropsWithChildren } from 'react';

import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { Spinner } from '@/global/components/spinner';
import { ContentPadding } from '@/global/layouts/content-padding';
import { RuleProtected } from '@/modules/user/permissions/components/protected';
import { RuleType } from '@prisma/client';

interface LayoutProps {
	params: Promise<{
		collegeSlug: string;
		programSlug: string;
	}>;
}

export const ProgramLayout = async ({
	children,
	params
}: PropsWithChildren<LayoutProps>) => {
	const { collegeSlug, programSlug } = await params;

	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	const makeRoute = (page: string) =>
		`/${collegeSlug}/program/${programSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={program.name} tags={['Smjer']} />

			<ContentPadding size="lg">
				<Suspense fallback={<Spinner />}>
					<Tabs>
						<Tab route={makeRoute('')}>Rasprava</Tab>
						<Tab route={makeRoute('/subjects')}>Predmeti</Tab>
						<RuleProtected rule={RuleType.CAN_MASS_UPLOAD} scopeId={program.id}>
							<Tab route={makeRoute('/mass-upload')}>Mass Upload</Tab>
						</RuleProtected>
					</Tabs>
				</Suspense>
			</ContentPadding>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</Container>
	);
};
