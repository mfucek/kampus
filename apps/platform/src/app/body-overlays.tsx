import { Toaster } from '@/lib/shadcn/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

export const BodyOverlays = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<NextTopLoader color="#3461ff" shadow={false} showSpinner={false} />
			{children}
			<Toaster />
		</>
	);
};
