export const parallelBatch = async <T>(
	items: T[],
	batchSize: number,
	callback: (items: T[], index: number, total: number) => Promise<void>
) => {
	for (let i = 0; i < items.length; i += batchSize) {
		const itemsChunk = items.slice(i, i + batchSize);
		await callback(itemsChunk, i, items.length);
	}
};

export const smartParallelBatch = async <T>(
	items: T[],
	batchSize: number,
	callback: (items: T[], index: number, total: number) => Promise<void>
) => {
	let currentBatchSize = Math.max(1, Math.round(batchSize));
	let previousTimePerItem: number | null = null;
	let i = 0;

	while (i < items.length) {
		const itemsChunk = items.slice(i, i + currentBatchSize);
		const actualBatchSize = itemsChunk.length;

		// Measure processing time for this batch
		const startTime = Date.now();
		await callback(itemsChunk, i, items.length);
		const endTime = Date.now();
		const totalTime = endTime - startTime;
		const timePerItem = totalTime / actualBatchSize;

		// Adjust batch size based on performance
		if (previousTimePerItem !== null) {
			if (timePerItem < previousTimePerItem) {
				// Performance improved, increase batch size by 50%
				currentBatchSize = Math.max(1, Math.round(currentBatchSize * 1.2));
			} else if (timePerItem > previousTimePerItem) {
				// Performance degraded, decrease batch size by 50%
				currentBatchSize = Math.max(1, Math.round(currentBatchSize * 0.2));
			}
			// If timePerItem === previousTimePerItem, keep current batch size
		}

		previousTimePerItem = timePerItem;
		i += actualBatchSize;
	}
};
