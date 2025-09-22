import { FC, PropsWithChildren } from 'react';

export const PostActions: FC<PropsWithChildren> = ({ children }) => {
	return <div className="flex flex-row gap-2">{children}</div>;
};
