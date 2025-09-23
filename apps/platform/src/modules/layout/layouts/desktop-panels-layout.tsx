'use client';

import { useRouter } from 'next/navigation';
import { type FC, type PropsWithChildren, useRef, useState } from 'react';
import {
	type ImperativePanelGroupHandle,
	type ImperativePanelHandle,
	Panel,
	PanelGroup
} from 'react-resizable-panels';

import { Icon } from '@/global/components/icon';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { BookmarksContent } from '../bookmarks/bookmarks-content';
import { PanelCloseWarning } from '../components/panel-close-warning';
import { ResizeHandle } from '../components/resize-handle';
import { useLayout } from '../contexts/use-layout';
import { PostContent } from '../post-panel-content';

export const DesktopPanelsLayout: FC<PropsWithChildren> = ({ children }) => {
	const { postId, showBookmarks, setPostId } = useLayout();

	const router = useRouter();

	const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
	const postPanelRef = useRef<ImperativePanelHandle>(null);

	const [willPostPanelClose, setWillPostPanelClose] = useState(false);

	return (
		<div className="bg-background md:p-2 w-full h-full overflow-hidden flex flex-row">
			{/* Bookmarks Panel */}
			{showBookmarks && (
				<div
					className="relative rounded-lg md:bg-section flex flex-col items-center w-[200px] mr-2"
					style={{ overflow: 'hidden', overflowY: 'auto' }}
					id="bookmarks-panel"
				>
					<BookmarksContent />
				</div>
			)}

			<PanelGroup
				autoSaveId="layout-bookmarks-post"
				direction="horizontal"
				ref={panelGroupRef}
			>
				{/* Main Panel */}
				<Panel
					className="rounded-lg md:bg-section flex flex-col items-center min-h-full"
					style={{ overflow: 'hidden', overflowY: 'auto' }}
					order={0}
					id="main-panel"
				>
					{children}
				</Panel>

				{/* Post Panel */}
				{postId && (
					<>
						<ResizeHandle
							willCollapse={willPostPanelClose}
							onDragEnd={() => {
								if (willPostPanelClose) {
									setPostId(null);
								}
							}}
						/>
						<Panel
							className="relative rounded-lg md:bg-section flex flex-col items-center"
							style={{ overflow: 'hidden', overflowY: 'auto' }}
							order={1}
							ref={postPanelRef}
							id="post-panel"
							onResize={(size) => {
								setWillPostPanelClose(size <= 25);
							}}
						>
							<PanelCloseWarning willCollapse={willPostPanelClose} />

							<div className="hidden md:flex flex-row w-full justify-end p-2">
								<Button
									variant="ghost-weak"
									size="sm"
									iconOnly
									onClick={() => {
										router.push(`/post/${postId}`);
										setPostId(null);
									}}
								>
									<Icon icon="fullscreen-expand" />
								</Button>
								<Button
									variant="ghost-weak"
									size="sm"
									iconOnly
									onClick={() => setPostId(null)}
								>
									<Icon icon="close" />
								</Button>
							</div>

							<ContentPadding size="sm">
								<PostContent postId={postId} />
							</ContentPadding>
						</Panel>
					</>
				)}
			</PanelGroup>
		</div>
	);
};
