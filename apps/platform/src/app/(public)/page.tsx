import { api } from '@/lib/trpc/server';
import { Navbar } from '@/modules/global/components/navbar';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton
} from '@clerk/nextjs';
import type { FC } from 'react';
import { Stripe } from './stripe';

const Page: FC = async () => {
	const { userId, account } = await api.me();

	return (
		<div>
			<p>Landing Page</p>

			<Navbar />
			<SignedOut>
				<SignInButton />
				<SignUpButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>

			<p>Account: {account?.id}</p>
			<p>User: {userId}</p>
			<p>Status: {account?.status}</p>

			{account?.status === 'INACTIVE' && (
				<>
					<Stripe />
				</>
			)}
		</div>
	);
};

export default Page;
