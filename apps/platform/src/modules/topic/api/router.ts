import { createTRPCRouter } from '@/deps/trpc/trpc';

import { collegeGetByIdProcedure } from './procedures/college/get-by-id';
import { collegeGetBySlugProcedure } from './procedures/college/get-by-slug';
import { collegesListAllProcedure } from './procedures/college/list-all';
import { generalTopicGetByIdProcedure } from './procedures/general-topic/get-by-id';
import { generalTopicGetBySlugProcedure } from './procedures/general-topic/get-by-slug';
import { generalTopicsListAllProcedure } from './procedures/general-topic/list-all';
import { programGetByIdProcedure } from './procedures/program/get-by-id';
import { programGetBySlugProcedure } from './procedures/program/get-by-slug';
import { programsListByCollegeIdProcedure } from './procedures/program/list-by-college-id';
import { staffGetByIdProcedure } from './procedures/staff/get-by-id';
import { staffGetBySlugProcedure } from './procedures/staff/get-by-slug';
import { staffsListBySubjectIdProcedure } from './procedures/staff/list-by-subject-id';
import { subjectGetByIdProcedure } from './procedures/subject/get-by-id';
import { subjectGetBySlugProcedure } from './procedures/subject/get-by-slug';
import { subjectHasDocumentOfKindProcedure } from './procedures/subject/has-document-of-kind';
import { subjectsListByCollegeIdProcedure } from './procedures/subject/list-by-college-id';
import { subjectsListByProgramIdProcedure } from './procedures/subject/list-by-program-id';

export const topicRouter = createTRPCRouter({
	general: createTRPCRouter({
		getById: generalTopicGetByIdProcedure,
		getBySlug: generalTopicGetBySlugProcedure,
		listAll: generalTopicsListAllProcedure
	}),
	college: createTRPCRouter({
		getById: collegeGetByIdProcedure,
		getBySlug: collegeGetBySlugProcedure,
		listAll: collegesListAllProcedure
	}),
	program: createTRPCRouter({
		getById: programGetByIdProcedure,
		getBySlug: programGetBySlugProcedure,
		listByCollegeId: programsListByCollegeIdProcedure
	}),
	staff: createTRPCRouter({
		getById: staffGetByIdProcedure,
		getBySlug: staffGetBySlugProcedure,
		listByCollegeId: staffsListBySubjectIdProcedure,
		listBySubjectId: staffsListBySubjectIdProcedure
	}),
	subject: createTRPCRouter({
		getById: subjectGetByIdProcedure,
		getBySlug: subjectGetBySlugProcedure,
		listByProgramId: subjectsListByProgramIdProcedure,
		listByCollegeId: subjectsListByCollegeIdProcedure,
		hasDocumentOfKindProcedure: subjectHasDocumentOfKindProcedure
	})
});
