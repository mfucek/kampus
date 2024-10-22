'use client';

import { Icon } from '@/global/components/icon';
import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle
} from '@/lib/shadcn/ui/drawer';
import { useIsMobile } from '@/utils/useMediaQuery';
import { type PropsWithChildren } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ThreadContent } from '../layouts/thread-content';
import { usePostId } from './post-id-provider';

export const ClientPanels: React.FC<PropsWithChildren> = ({ children }) => {
	const { isMobile } = useIsMobile();

	const { postId, setPostId } = usePostId();

	if (isMobile) {
		return (
			<div className="bg-background md:p-2 w-full h-full">
				<div className="rounded-lg bg-section flex flex-col items-center">
					{children}
				</div>
				<Drawer open={!!postId} onClose={() => setPostId(null)}>
					<DrawerContent>
						<DrawerHeader className="hidden">
							<DrawerTitle>Are you absolutely sure?</DrawerTitle>
							<DrawerDescription>
								This action cannot be undone.
							</DrawerDescription>
						</DrawerHeader>
						<div className="w-full h-full overflow-y-scroll">
							<ThreadContent />
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		);
	}

	return (
		<div className="bg-background md:p-2 w-full h-full overflow-hidden">
			<PanelGroup autoSaveId="example" direction="horizontal">
				<Panel
					className="rounded-lg bg-section flex flex-col items-center"
					style={{ overflow: 'hidden', overflowY: 'auto' }}
					order={0}
					id="main-panel"
				>
					{children}
				</Panel>
				{postId && <ResizeHandle vertical />}
				{postId && (
					<Panel
						className="rounded-lg bg-section flex flex-col items-center relative"
						style={{ overflow: 'hidden', overflowY: 'scroll' }}
						order={1}
						id="discussion-panel"
					>
						<div className="absolute top-6 right-6">
							<Button variant="ghost" iconOnly onClick={() => setPostId(null)}>
								<Icon icon="close" />
							</Button>
						</div>
						<ThreadContent />
					</Panel>
				)}
			</PanelGroup>
		</div>
	);
};
