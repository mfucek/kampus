'use client';

import { type FC } from 'react';

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/global/components/card-tabs';
import { Icon } from '@/global/components/icon';
import { SectionList } from '@/global/components/section-list';
import { Button } from '@/lib/shadcn/ui/button';
import { groupByKey } from '@/utils/group-by-key';
import Link from 'next/link';
import { ListSubjectsByProgramIdItem } from '../../api/procedures/subject/list-by-program-id';

export const ProgramSubjectsList: FC<{
	subjects: ListSubjectsByProgramIdItem[];
}> = ({ subjects }) => {
	const uniqueSemesters = [
		...new Set(subjects.map((subject) => subject.programSubject.semester))
	]
		.filter((semester) => semester !== null)
		.sort();

	const subjectsBySemester = groupByKey(
		subjects,
		'programSubject.semester',
		'Ostali predmeti'
	);

	const semesters = Object.keys(subjectsBySemester).sort();

	return (
		<>
			<Tabs
				defaultValue={`${uniqueSemesters[0]}`}
				className="flex flex-col gap-10"
			>
				<TabsList className="md:grid-cols-6">
					{semesters.map((semester) => (
						<TabsTrigger key={semester} value={`${semester}`}>
							{`${semester}. semestar`}
						</TabsTrigger>
					))}
				</TabsList>
				{Object.entries(subjectsBySemester).map(([semester, subjects]) => (
					<TabsContent key={semester} value={`${semester}`}>
						<div className="flex flex-col gap-6 md:gap-10">
							{Object.entries(
								groupByKey(
									subjects,
									'programSubject.groupName',
									'Ostali predmeti'
								)
							).map(([group, subjects], index) => (
								<SectionList
									key={index}
									title={group}
									info={`${subjects.length} predmeta`}
									data={subjects}
									rows={(subject) => (
										<>
											<div className="flex flex-col gap-1">
												<div>{subject.topic.name}</div>
												<p className="text-neutral-strong caption">
													{subject.subject.ects} ECTS
													<span className="text-neutral-medium caption px-2">
														{'·'}
													</span>
													{/* {subject.staffs
														.map((s) => {
															const words = s.split(' ');
															return `${words[0]![0]}. ${words.slice(1).join(' ')}`;
														})
														.join(', ')} */}
												</p>
											</div>
										</>
									)}
									actions={(subject) => (
										<>
											<Link href={`${subject.link}/staff`}>
												<Button variant="outline" size="sm">
													{subject.staffsCount}
													<Icon icon="users" />
												</Button>
											</Link>
											<Link href={`${subject.link}/`}>
												<Button variant="outline" size="sm">
													{subject.postsCount}
													<Icon icon="chat-single" />
												</Button>
											</Link>
										</>
									)}
								/>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</>
	);
};
