import { type FC } from 'react';

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/global/components/card-tabs';
import { api } from '@/lib/trpc/server';
import { type GetSubjectsOutput } from '../api/procedures/get-subjects';
import { SubjectGroupTable } from './subject-group-table';

const groupSubjectsByGroupFilterBySemester = (
	subjects: GetSubjectsOutput[],
	semester: number
) => {
	const grouped: Record<string, GetSubjectsOutput[]> = {};

	for (const subject of subjects) {
		if (subject.semester !== semester) {
			continue;
		}

		const group = subject.groupName || 'Ostalo';

		if (!grouped[group]) {
			grouped[group] = [];
		}

		grouped[group].push(subject);
	}

	return grouped;
};

export const ProgramSubjectsList: FC<{ programId: string }> = async ({
	programId
}) => {
	const subjects = await api.program.listSubjects({
		programId
	});

	const program = await api.program.getById({
		programId
	});

	const uniqueSemesters = [
		...new Set(subjects.map((subject) => subject.semester))
	]
		.filter((semester) => semester !== null)
		.sort();

	return (
		<>
			<Tabs defaultValue={`${uniqueSemesters[0]}`}>
				<TabsList className="md:grid-cols-6">
					{uniqueSemesters.map((semester) => (
						<TabsTrigger key={semester} value={`${semester}`}>
							{`${semester}. semestar`}
						</TabsTrigger>
					))}
				</TabsList>
				{uniqueSemesters.map((semester) => (
					<TabsContent key={semester} value={`${semester}`}>
						<div className="flex flex-col gap-4">
							{Object.entries(
								groupSubjectsByGroupFilterBySemester(subjects, semester)
							).map(([group, subjects], index) => (
								<SubjectGroupTable
									key={`group-${index}`}
									subjects={subjects}
									collegeSlug={program.college.slug}
									groupName={group}
								/>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</>
	);
};
