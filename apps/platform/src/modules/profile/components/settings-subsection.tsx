import type { FC, PropsWithChildren } from 'react';

export const SettingsSubSection: FC<
	PropsWithChildren & {
		title: string;
		description?: string;
	}
> = ({ children, title, description }) => {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<p className="title-3">{title}</p>
				<p className="body-2 text-neutral-strong">{description}</p>
			</div>
			{children}
		</div>
	);
};
