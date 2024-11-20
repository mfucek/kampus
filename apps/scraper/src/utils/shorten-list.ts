export const shortenList = <T>(
	list: T[],
	opts?: {
		enabled?: boolean;
		maxLength?: number;
	}
) => {
	return opts?.enabled ? list.slice(0, opts.maxLength ?? 1) : list;
};
