'use client';

import { Icon } from '@/global/components/icon';
import { SectionList } from '@/global/components/section-list';
import { Button } from '@/lib/shadcn/ui/button';
import { groupByKey } from '../../../utils/group-by-key';
import { ListStaffItem } from '../api/procedures/list-staff';

export const SubjectStaffList = ({ staffs }: { staffs: ListStaffItem[] }) => {
	const staffByRole = groupByKey(staffs, 'staffRole', 'Ostali');

	return (
		<div className="flex flex-col gap-6 md:gap-10">
			{Object.entries(staffByRole).map(([role, staff]) => (
				<SectionList
					key={role}
					data={staff}
					rows={(staff) => (
						<>
							<div className="text-neutral">{staff.name}</div>
						</>
					)}
					actions={(staff) => (
						<>
							<Button variant="outline" size="sm">
								{staff.topLevelPosts}
								<Icon icon="chat-single" />
							</Button>
						</>
					)}
					title={role}
					info={`${staff.length} nastavnika`}
					showAll={true}
				/>
			))}
		</div>
	);
};
