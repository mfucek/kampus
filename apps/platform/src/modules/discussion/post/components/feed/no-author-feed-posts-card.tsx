export const NoAuthorFeedPostsCard = () => {
	return (
		<div className="p-3 py-10 rounded-xl md:bg-neutral-weak bg-section flex flex-col gap-2">
			<p className="title-1 text-center text-neutral">Nema objava</p>
			<p className="body-2 text-center text-neutral-strong">
				Ovaj korisnik jos nije objavio ni jednu objavu.
			</p>
		</div>
	);
};
