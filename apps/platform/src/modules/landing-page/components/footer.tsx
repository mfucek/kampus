import Link from 'next/link';

export const Footer = () => {
	return (
		<footer className="flex flex-col md:flex-row gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-t-neutral-weak md:justify-between bg-section">
			<p className="body-3 text-neutral-strong">
				© {new Date().getFullYear()} Kampus.hr. Sva prava pridržana.
			</p>
			<nav className="flex gap-4 sm:gap-6">
				<Link
					className="button-sm hover:underline underline-offset-4"
					href="/legal/terms-of-service"
				>
					Uvjeti korištenja
				</Link>
				<Link
					className="button-sm hover:underline underline-offset-4"
					href="/legal/privacy-policy"
				>
					Privatnost
				</Link>
			</nav>
		</footer>
	);
};
