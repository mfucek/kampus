import { ContentPadding } from '@/global/layouts/content-padding';
import type { FC, PropsWithChildren } from 'react';

export const SettingsSubSection: FC<
	PropsWithChildren & {
		title: string | React.ReactNode;
		description?: string;
	}
> = ({ children, title, description }) => {
	return (
		<ContentPadding size="lg">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<p className="title-3 text-neutral">{title}</p>
					<p className="body-2 text-neutral-strong">{description}</p>
				</div>
				{children}
			</div>
		</ContentPadding>
	);
};
