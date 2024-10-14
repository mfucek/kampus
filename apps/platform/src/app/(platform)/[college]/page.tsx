'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/react';
import { PageHeader } from '@/modules/college/components/page-header';
import { Container } from '@/modules/global/components/container';
import type { FC } from 'react';

interface PageProps {
	params: {
		college: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { college } = params;

	const { data, isLoading } = api.college.getBySlug.useQuery(college);

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader title={data?.name ?? ''} icon="https://picsum.photos/48/48" />

			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Opca Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Predmeti</TabsTrigger>
					<TabsTrigger value="staff">Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">Diskusija</TabsContent>
				<TabsContent value="subjects">Predmeti</TabsContent>
				<TabsContent value="staff">Profesori</TabsContent>
			</Tabs>
		</Container>
	);
};

export default Page;
