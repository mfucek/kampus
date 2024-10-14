import { FC, PropsWithChildren } from 'react';

export const Container: FC<PropsWithChildren> = ({ children }) => {
	return <div className="w-full max-w-[800px] mx-auto">{children}</div>;
};
