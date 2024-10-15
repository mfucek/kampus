'use client';

import { TopicLayout } from '@/modules/global/layouts/topic-layout';
import { ReactNode } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

interface ClientPanelsProps {
	children: ReactNode;
}

export const ClientPanels: React.FC<ClientPanelsProps> = ({ children }) => {
	return (
		<div className="flex-1 bg-background md:p-2 flex flex-row gap-2">
			<PanelGroup
				autoSaveId="example"
				direction="horizontal"
				className="w-full h-full"
			>
				<Panel>
					<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
						{children}
					</div>
				</Panel>
				<TopicLayout />
			</PanelGroup>
		</div>
	);
};
