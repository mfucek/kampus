import { type FC, type PropsWithChildren } from 'react';

import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { Tab, Tabs } from '@/global/components/route-tabs';
import { api } from '@/lib/trpc/server';
import { RuleProtected } from '@/modules/permissions/components/protected';
import { RuleType } from '@prisma/client';

interface LayoutProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeLayout: FC<LayoutProps & PropsWithChildren> = async ({
	children,
	params
}) => {
	const { collegeSlug } = await params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	const makeRoute = (page: string) => `/${collegeSlug}${page}`;

	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title={college.name} tags={['Fakultet']} />

			<Tabs>
				<Tab route={makeRoute('')}>Opca Rasprava</Tab>
				<Tab route={makeRoute('/programs')}>Smjerovi</Tab>
				<Tab route={makeRoute('/all-subjects')}>Svi predmeti</Tab>
				<Tab route={makeRoute('/all-staff')}>Svi nastavnici</Tab>
				<RuleProtected rule={RuleType.CAN_MASS_UPLOAD} scopeId={college.id}>
					<Tab route={makeRoute('/mass-upload')}>
						Mass Upload (svi smjerovi)
					</Tab>
				</RuleProtected>
			</Tabs>

			{children}
		</Container>
	);
};
