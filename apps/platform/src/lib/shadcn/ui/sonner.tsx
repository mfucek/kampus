'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						'group toast bg-foreground! group-[.toaster]:bg-foreground group-[.toaster]:text-neutral! group-[.toaster]:border-neutral-weak! group-[.toaster]:shadow-lg backdrop-blur-sm',
					description: 'group-[.toast]:text-neutral-strong!',
					error: 'bg-red-500',
					actionButton:
						'group-[.toast]:bg-accent! group-[.toast]:text-accent-contrast!',
					cancelButton:
						'group-[.toast]:bg-neutral! group-[.toast]:text-neutral-contrast!'
				}
			}}
			{...props}
		/>
	);
};

export { Toaster };
