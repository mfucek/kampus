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
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import Link from 'next/link';
import { type ListByDepartmentItem } from '../api/procedures/list';

const ProgramsList: FC<{
	programs: ListByDepartmentItem[];
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

const groupPrograms = (programs: ListByDepartmentItem[]) => {
	const departmentTypePrograms: Record<
		string,
		Record<string, ListByDepartmentItem[]>
	> = {};

	for (const program of programs) {
		const type = program.type ?? 'Ostalo';
		const departments =
			program.department.length === 0 ? ['Ostalo'] : program.department;

		for (const department of departments) {
			if (!departmentTypePrograms[department]) {
				departmentTypePrograms[department] = {};
			}

			if (!departmentTypePrograms[department][type]) {
				departmentTypePrograms[department][type] = [];
			}

			departmentTypePrograms[department][type].push(program);
		}
	}

	return departmentTypePrograms;
};

export const CollegePrograms: FC<{ collegeId: string }> = ({ collegeId }) => {
	const { data: departmentPrograms } = api.program.list.useQuery({
		collegeId
	});
	const { data: college } = api.college.getById.useQuery({
		collegeId
	});

	if (!departmentPrograms || !college) {
		return null;
	}

	const groupedPrograms = groupPrograms(departmentPrograms);

	const departments = Object.keys(groupedPrograms);
	const showTabs = departments.length > 1;

	return (
		<>
			<Tabs defaultValue={departments[0]}>
				{showTabs && (
					<TabsList className="mb-4 px-4 lg:px-0 overflow-x-auto">
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
				{departments.map((department) => {
					const types = Object.keys(groupedPrograms[department]!);
					return (
						<TabsContent key={department} value={department}>
							<div className="flex flex-col gap-4 px-4 lg:px-0">
								{types.map((type) => (
									<div key={department + type} className="flex flex-col gap-2">
										<div className="px-3 caption text-neutral-strong">
											{type}
										</div>
										<ProgramsList
											key={department + type}
											collegeSlug={college.slug}
											programs={groupedPrograms[department]![type]!}
										/>
									</div>
								))}
							</div>
						</TabsContent>
					);
				})}
			</Tabs>
		</>
	);
};
