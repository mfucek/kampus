import { Navbar } from '@/modules/landing-page/components/navbar';
import type { FC, PropsWithChildren } from 'react';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
};

export default PublicLayout;
