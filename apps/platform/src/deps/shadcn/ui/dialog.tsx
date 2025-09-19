'use client';

import * as React from 'react';

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/lib/shadcn/ui/drawer';
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger
} from '@/lib/shadcn/ui/modal';
import { useIsMobile } from '@/utils/useMediaQuery';

interface BaseProps {
	children: React.ReactNode;
}

interface RootDialogProps extends BaseProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

interface DialogProps extends BaseProps {
	className?: string;
	asChild?: true;
}

const Dialog = ({ children, ...props }: RootDialogProps) => {
	const { isDesktop } = useIsMobile();
	const Dialog = isDesktop ? Modal : Drawer;

	return <Dialog {...props}>{children}</Dialog>;
};

const DialogTrigger = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogTrigger = isDesktop ? ModalTrigger : DrawerTrigger;

	return (
		<DialogTrigger className={className} {...props}>
			{children}
		</DialogTrigger>
	);
};

const DialogClose = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogClose = isDesktop ? ModalClose : DrawerClose;

	return (
		<DialogClose className={className} {...props}>
			{children}
		</DialogClose>
	);
};

const DialogContent = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogContent = isDesktop ? ModalContent : DrawerContent;

	return (
		<DialogContent className={className} {...props}>
			{children}
		</DialogContent>
	);
};

const DialogDescription = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogDescription = isDesktop ? ModalDescription : DrawerDescription;

	return (
		<DialogDescription className={className} {...props}>
			{children}
		</DialogDescription>
	);
};

const DialogHeader = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogHeader = isDesktop ? ModalHeader : DrawerHeader;

	return (
		<DialogHeader className={className} {...props}>
			{children}
		</DialogHeader>
	);
};

const DialogTitle = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogTitle = isDesktop ? ModalTitle : DrawerTitle;

	return (
		<DialogTitle className={className} {...props}>
			{children}
		</DialogTitle>
	);
};

const DialogBody = ({ className, children, ...props }: DialogProps) => {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
};

const DialogFooter = ({ className, children, ...props }: DialogProps) => {
	const { isDesktop } = useIsMobile();
	const DialogFooter = isDesktop ? ModalFooter : DrawerFooter;

	return (
		<DialogFooter className={className} {...props}>
			{children}
		</DialogFooter>
	);
};

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
};
