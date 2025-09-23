'use client';

import { useViewportSize } from '@/deps/viewport-size';
import { type FC, type PropsWithChildren } from 'react';

import { DesktopPanelsLayout } from './desktop-panels-layout';
import { MobilePanelsLayout } from './mobile-panels-layout';

export const PanelsLayout: FC<PropsWithChildren> = ({ children }) => {
	const { isMobile } = useViewportSize();

	if (isMobile) {
		return <MobilePanelsLayout>{children}</MobilePanelsLayout>;
	}

	return <DesktopPanelsLayout>{children}</DesktopPanelsLayout>;
};
