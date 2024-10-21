export const Footer = () => {
	return (
		<footer className="flex flex-col md:flex-row gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-t-neutral-weak md:justify-between bg-section">
			<p className="body-3 text-neutral-strong">
				© 2024 Referada.hr. Sva prava pridržana.
			</p>
			<nav className="flex gap-4 sm:gap-6">
				<a className="button-sm hover:underline underline-offset-4" href="#">
					Uvjeti korištenja
				</a>
				<a className="button-sm hover:underline underline-offset-4" href="#">
					Privatnost
				</a>
			</nav>
		</footer>
	);
};
