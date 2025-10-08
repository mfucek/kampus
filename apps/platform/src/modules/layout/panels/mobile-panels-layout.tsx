'use client';

import { useRouter } from 'next/navigation';
import { type FC, type PropsWithChildren } from 'react';
import { useLayout } from '../contexts/use-layout';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle
} from '@/lib/shadcn/ui/drawer';
import { PostContent } from '../post-panel-content';

export const MobilePanelsLayout: FC<PropsWithChildren> = ({ children }) => {
	const { postId, setPostId } = useLayout();
	const router = useRouter();

	return (
		<div className="bg-background md:p-2 w-full md:h-full">
			<div className="rounded-lg md:bg-section flex flex-col items-center min-h-full">
				{children}
			</div>

			<Drawer open={!!postId} onClose={() => setPostId(null)}>
				<DrawerContent>
					<DrawerHeader className="hidden">
						<DrawerTitle>Are you absolutely sure?</DrawerTitle>
						<DrawerDescription>This action cannot be undone.</DrawerDescription>
					</DrawerHeader>
					<div className="absolute left-3 top-3">
						<Button variant="ghost" iconOnly onClick={() => router.back()}>
							<Icon icon="arrow-left" />
						</Button>
					</div>
					<div className="w-full h-full overflow-y-scroll">
						{/* Content */}
						<Container className="py-10">
							<div className="w-full h-full flex flex-col px-4">
								<div className="flex flex-col w-full gap-10">
									{postId && <PostContent postId={postId} />}
								</div>
							</div>
						</Container>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
