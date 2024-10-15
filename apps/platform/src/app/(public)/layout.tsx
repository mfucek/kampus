import type { FC, PropsWithChildren } from 'react';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
	return <div>{children}</div>;
};

export default PublicLayout;
