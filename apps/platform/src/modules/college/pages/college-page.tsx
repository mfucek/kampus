import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { SubjectsTable } from '@/modules/subject/components/subjects-table';
import type { FC } from 'react';
import { StaffTab } from '../components/college-staff';

const DiscussionTab: FC<{ collegeSlug: string; collegeId: string }> = async ({
	collegeSlug,
	collegeId
}) => {
	const fullPosts = await api.post.listPostsByCollegeSlug({ collegeSlug });
	return (
		<div className="flex flex-col gap-10">
			<Composer collegeId={collegeId} collegeSlug={collegeSlug} />
			<div className="flex flex-col">
				{fullPosts.map((fullPost) => (
					<Post key={fullPost.post.id} fullPost={fullPost} depthInfo={[]} />
				))}
			</div>
		</div>
	);
};

const SubjectsTab: FC<{ collegeSlug: string }> = async ({ collegeSlug }) => {
	const subjects = await api.subject.listByCollegeSlug({ collegeSlug });
	return <SubjectsTable subjects={subjects} />;
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
					<TabsTrigger value="staff">Svi Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<DiscussionTab collegeSlug={collegeSlug} collegeId={college.id} />
				</TabsContent>
				<TabsContent value="subjects">
					<SubjectsTab collegeSlug={collegeSlug} />
				</TabsContent>
				<TabsContent value="staff">
					<StaffTab collegeSlug={collegeSlug} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
