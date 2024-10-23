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
import { cn } from '@/lib/shadcn/utils';
import { useIsMobile } from '@/utils/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useRef, useState, type PropsWithChildren } from 'react';
import {
	ImperativePanelGroupHandle,
	Panel,
	PanelGroup
} from 'react-resizable-panels';
import { ThreadContent } from '../layouts/thread-content';
import { usePostId } from './post-id-provider';

export const ClientPanels: React.FC<PropsWithChildren> = ({ children }) => {
	const { isMobile } = useIsMobile();

	const { postId, setPostId } = usePostId();
	const router = useRouter();

	const ref = useRef<ImperativePanelGroupHandle>(null);

	const [willCollapse, setWillCollapse] = useState(false);

	if (isMobile) {
		return (
			<div className="bg-background md:p-2 w-full h-full">
				<div className="rounded-lg bg-section flex flex-col items-center min-h-full">
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
						<div className="absolute left-3 top-3">
							<Button variant="ghost" iconOnly onClick={() => router.back()}>
								<Icon icon="arrow-left" />
							</Button>
						</div>
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
			<PanelGroup autoSaveId="example" direction="horizontal" ref={ref}>
				<Panel
					className="rounded-lg bg-section flex flex-col items-center min-h-full"
					style={{ overflow: 'hidden', overflowY: 'auto' }}
					order={0}
					id="main-panel"
				>
					{children}
				</Panel>
				{postId && <ResizeHandle vertical willCollapse={willCollapse} />}
				{postId && (
					<Panel
						className={'flex flex-col relative'}
						order={1}
						id="discussion-panel"
						collapsible
						onResize={(size) => {
							setWillCollapse((size * window.innerWidth) / 100 <= 375);
						}}
						defaultSize={50}
						onCollapse={() => setPostId(null)}
						onExpand={() => {
							ref.current?.setLayout([50, 50]);
						}}
					>
						<div
							className={cn(
								'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100'
							)}
						>
							<Icon
								size={160}
								className={cn(
									'bg-danger duration-200 pointer-events-none',
									willCollapse
										? 'opacity-100 scale-100'
										: 'opacity-0 scale-[0.2]'
								)}
								icon="close"
							/>
						</div>
						<div
							className={cn(
								'rounded-lg bg-section flex flex-col items-center relative duration-200 h-full',
								willCollapse && 'opacity-50 blur-sm'
							)}
							style={{ overflow: 'hidden', overflowY: 'scroll' }}
						>
							<div className="absolute top-6 right-6">
								<Button
									variant="ghost"
									iconOnly
									onClick={() => setPostId(null)}
								>
									<Icon icon="close" />
								</Button>
							</div>
							<ThreadContent />
						</div>
					</Panel>
				)}
			</PanelGroup>
		</div>
	);
};
