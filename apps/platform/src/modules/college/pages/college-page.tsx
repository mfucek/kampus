import type { FC } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';

import { Container } from '@/global/components/container';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';
import { CollegePrograms } from '@/modules/program/components/college-programs';
import { StaffsTableAdvanced } from '@/modules/staff/components/staffs-table-advanced';
import { SubjectsTableAdvanced } from '@/modules/subject/components/subjects-table-advanced';

const DiscussionTab: FC<{ collegeId: string }> = async ({ collegeId }) => {
	return (
		<div className="flex flex-col gap-10">
			<Composer collegeId={collegeId} />
			<InfiniteScrollTopLevelPosts
				scope={{
					college: {
						id: collegeId
					}
				}}
			/>
		</div>
	);
};

const ProgramsTab: FC<{ collegeId: string }> = async ({ collegeId }) => {
	return (
		<div className="flex flex-col gap-2">
			<CollegePrograms collegeId={collegeId} />
		</div>
	);
};

const SubjectsTab: FC<{ collegeId: string }> = async ({ collegeId }) => {
	return (
		<div className="flex flex-col gap-2">
			<SubjectsTableAdvanced scope={{ collegeId }} />
		</div>
	);
};

export const StaffTab: FC<{ collegeSlug: string }> = ({ collegeSlug }) => {
	return (
		<div className="flex flex-col gap-2">
			<StaffsTableAdvanced scope={{ collegeSlug }} />
		</div>
	);
};

export const CollegePage: FC<{ collegeSlug: string }> = async ({
	collegeSlug
}) => {
	const college = await api.college.getBySlug({ collegeSlug });

	return (
		<Container className="flex flex-col gap-10 py-10 h-full">
			<PageHeader collegeSlug={collegeSlug} collegeName={college.name} />

			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Opca Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Popis Predmeta</TabsTrigger>
					<TabsTrigger value="programs">Smjerovi</TabsTrigger>
					<TabsTrigger value="staff">Svi Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<DiscussionTab collegeId={college.id} />
				</TabsContent>
				<TabsContent value="subjects">
					<SubjectsTab collegeId={college.id} />
				</TabsContent>
				<TabsContent value="programs">
					<ProgramsTab collegeId={college.id} />
				</TabsContent>
				<TabsContent value="staff">
					<StaffTab collegeSlug={collegeSlug} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
