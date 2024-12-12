'use client';

import { useRouter } from 'next/navigation';
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
import { type ListProgramsItem } from '../api/procedures/list-programs';

const ProgramsList: FC<{
	programs: ListProgramsItem[];
	collegeSlug: string;
}> = ({ programs, collegeSlug }) => {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-px rounded-xl overflow-hidden">
			{programs.map((program) => (
				<Link key={program.id} href={`/${collegeSlug}/program/${program.slug}`}>
					<div
						className="flex flex-row items-center justify-between bg-neutral-weak cursor-pointer md:border-section border-background p-4"
						onClick={() => {
							router.push(`/${collegeSlug}/program/${program.slug}`);
						}}
					>
						<div className="button-md">{program.name}</div>
						<Button iconOnly size="xs" theme="accent" variant="ghost">
							<Icon icon="arrow-right" />
						</Button>
					</div>
				</Link>
			))}
		</div>
	);
};

export const CollegeProgramsList = ({
	programs
}: {
	programs: ListProgramsItem[];
}) => {
	const programsByDepartment = groupByKey(
		programs,
		'department',
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
								{Object.entries(groupByKey(programs, 'type', 'Ostalo')).map(
									([type, programs]) => (
										<SectionList
											key={department + type}
											data={programs}
											rows={(program) => (
												<>
													<div className="text-neutral">{program.name}</div>
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
													<Link href={`${program.link}/staff`}>
														<Button variant="outline" size="sm">
															{program.topLevelPosts}
															<Icon icon="chat-single" />
														</Button>
													</Link>
												</>
											)}
											title={type}
											info={`${programs.length} programa`}
										/>
									)
								)}
							</div>
						</TabsContent>
					);
				})}
			</Tabs>
		</>
	);
};
