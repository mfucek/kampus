import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

export const BodyOverlays = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<NextTopLoader color="#3461ff" shadow={false} showSpinner={false} />
			{children}
			<Toaster />
		</>
	);
};
