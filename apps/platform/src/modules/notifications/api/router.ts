import { createTRPCRouter } from '@/deps/trpc/trpc';

import { clearProcedure } from './procedures/clear';
import { clearAllProcedure } from './procedures/clear-all';
import { listProcedure } from './procedures/list';

export const notificationsRouter = createTRPCRouter({
	list: listProcedure,
	clear: clearProcedure,
	clearAll: clearAllProcedure
});
