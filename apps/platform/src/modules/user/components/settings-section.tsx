import { ContentPadding } from '@/global/layouts/content-padding';
import type { FC, PropsWithChildren } from 'react';

export const SettingsSection: FC<
	PropsWithChildren & {
		title: string;
		description?: string;
		id?: string;
	}
> = ({ children, title, description, id }) => {
	return (
		<ContentPadding>
			<div className="flex flex-col @sm:flex-row gap-10" id={id}>
				<div className="flex flex-col gap-2 @sm:w-[240px]">
					<p className="title-1 text-neutral">{title}</p>
					<p className="body-2 text-neutral-strong">{description}</p>
				</div>
				<div className="flex flex-col gap-10 flex-1">{children}</div>
			</div>
		</ContentPadding>
	);
};
