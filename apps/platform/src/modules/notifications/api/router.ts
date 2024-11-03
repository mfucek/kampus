import { createTRPCRouter } from '@/server/api/trpc';

import { clearProcedure } from './procedures/clear';
import { clearAllProcedure } from './procedures/clear-all';
import { listProcedure } from './procedures/list';

export const postRouter = createTRPCRouter({
	list: listProcedure,
	clear: clearProcedure,
	clearAll: clearAllProcedure
});
