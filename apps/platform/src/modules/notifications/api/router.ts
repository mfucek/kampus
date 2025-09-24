import { createTRPCRouter } from '@/deps/trpc/trpc';
import { deleteAllProcedure } from './procedures/delete-all';
import { deleteByIdProcedure } from './procedures/delete-by-id';
import { listProcedure } from './procedures/list';

export const notificationRouter = createTRPCRouter({
	list: listProcedure,
	deleteById: deleteByIdProcedure,
	deleteAll: deleteAllProcedure
});
