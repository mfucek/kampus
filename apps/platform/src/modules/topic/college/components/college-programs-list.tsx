'use client';

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
import { type ListProgramsByCollegeIdItem } from '../../api/procedures/program/list-by-college-id';

export const CollegeProgramsList = ({
	programs
}: {
	programs: ListProgramsByCollegeIdItem[];
}) => {
	const programsByDepartment = groupByKey(
		programs,
		'program.departments',
		'Ostali smjerovi'
	);

	const departments = Object.keys(programsByDepartment);
	const showTabs = departments.length > 1;

	return (
		<>
			<Tabs defaultValue={departments[0]} className="flex flex-col gap-10">
				{showTabs && (
					<TabsList>
						{departments.map((department) => (
							<TabsTrigger
								key={department}
								value={department}
								className="min-w-[120px]"
							>
								{department}
							</TabsTrigger>
						))}
					</TabsList>
				)}
				{Object.entries(programsByDepartment).map(([department, programs]) => {
					return (
						<TabsContent key={department} value={department}>
							<div className="flex flex-col gap-6 md:gap-10">
								{Object.entries(
									groupByKey(programs, 'program.type', 'Ostalo')
								).map(([type, programs]) => (
									<SectionList
										key={department + type}
										data={programs}
										rows={(program) => (
											<>
												<div className="text-neutral">{program.topic.name}</div>
											</>
										)}
										actions={(program) => (
											<>
												<Link href={`${program.link}/subjects`}>
													<Button variant="outline" size="sm">
														{program.subjectsCount}
														<Icon icon="book-open" />
													</Button>
												</Link>
												<Link href={`${program.link}`}>
													<Button variant="outline" size="sm">
														{program.postsCount}
														<Icon icon="chat-single" />
													</Button>
												</Link>
											</>
										)}
										title={type}
										info={`${programs.length} smjerova`}
										showAll={true}
									/>
								))}
							</div>
						</TabsContent>
					);
				})}
			</Tabs>
		</>
	);
};
