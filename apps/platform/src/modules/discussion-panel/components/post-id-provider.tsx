import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

type PostIdContextType = {
	postId: string | null;
	setPostId: (id: string | null) => void;
};

const PostIdContext = createContext<PostIdContextType | undefined>(undefined);

export const PostIdProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const [postId, setPostIdState] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const postIdFromParams = searchParams.get('postId');
		if (postIdFromParams) {
			setPostIdState(postIdFromParams);
		}
	}, [searchParams]);

	const setPostId = (id: string | null) => {
		setPostIdState(id);
		if (id) {
			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.set('postId', id);
			router.push(`?${newSearchParams.toString()}`, { scroll: false });
		} else {
			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.delete('postId');
			router.push(`?${newSearchParams.toString()}`, { scroll: false });
		}
	};

	return (
		<PostIdContext.Provider value={{ postId, setPostId }}>
			{children}
		</PostIdContext.Provider>
	);
};

export const usePostId = () => {
	const context = useContext(PostIdContext);
	if (context === undefined) {
		throw new Error('usePostId must be used within a PostIdProvider');
	}
	return context;
};
