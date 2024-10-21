'use client';

import { type PropsWithChildren } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { TopicLayout } from '../layouts/topic-layout';

export const ClientPanels: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="bg-background md:p-2 w-full h-full overflow-hidden">
			<PanelGroup autoSaveId="example" direction="horizontal">
				<Panel
					className="rounded-lg bg-section flex flex-col items-center"
					style={{ overflow: 'hidden', overflowY: 'auto' }}
				>
					{children}
				</Panel>
				<TopicLayout />
			</PanelGroup>
		</div>
	);
};
