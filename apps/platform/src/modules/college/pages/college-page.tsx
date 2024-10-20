import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { StaffsTable } from '@/modules/staff/components/staffs-table';
import { SubjectsTable } from '@/modules/subject/components/subjects-table';
import { JSONContent } from '@tiptap/react';
import type { FC } from 'react';

export const CollegePage: FC<{ collegeSlug: string }> = async ({
	collegeSlug
}) => {
	const college = await api.college.getBySlug({ collegeSlug });

	const subjects = await api.subject.listByCollegeSlug({ collegeSlug });
	const staffs = await api.staff.listByCollegeSlug({ collegeSlug });

	const posts = await api.post.getCollegePostsByCollegeSlug({ collegeSlug });

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader collegeSlug={collegeSlug} collegeName={college.name} />

			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Opca Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Popis Predmeta</TabsTrigger>
					<TabsTrigger value="staff">Svi Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<div className="flex flex-col gap-10">
						<Composer collegeId={college.id} />
						<div className="flex flex-col">
							{posts.map((post) => (
								<Post
									key={post.id}
									postId={post.id}
									content={post.body as JSONContent}
									votes={post.votes}
									author={{
										displayName: post.author.displayName,
										imageUrl: post.author.imageUrl ?? undefined
									}}
								/>
							))}
						</div>
					</div>
				</TabsContent>
				<TabsContent value="subjects">
					<SubjectsTable subjects={subjects} />
				</TabsContent>
				<TabsContent value="staff">
					<StaffsTable staffs={staffs} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
