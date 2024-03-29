import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { GroupsService } from '@/api/groups/groups.service';
import {
	ERROR_GROUP_NOT_FOUND,
	ERROR_UUID_PIPE_MESSAGE,
} from '@/constants/business-error';

import {
	BadRequestServiceException,
	EntityNotFoundException,
} from '../exception/service.exception';

@Injectable()
export class GroupExistsMiddleware implements NestMiddleware {
	constructor(private readonly groupsService: GroupsService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const groupId = req.params.groupId;
		if (!groupId) {
			throw EntityNotFoundException(ERROR_GROUP_NOT_FOUND);
		}

		const schema = z.string().uuid();

		const validationResult = schema.safeParse(groupId);

		if (validationResult.success === false) {
			throw BadRequestServiceException(ERROR_UUID_PIPE_MESSAGE);
		}

		const groupExist = await this.groupsService.groupExistsByGroupId(groupId);

		if (!groupExist) throw EntityNotFoundException(ERROR_GROUP_NOT_FOUND);

		next();
	}
}
