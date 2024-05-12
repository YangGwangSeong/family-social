import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger';

import { ERROR_FILE_NOT_FOUND } from '@/constants/business-error';

export const PostUploadProfileSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '멤버 프로필 업로드',
		}),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					files: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		}),
		ApiConsumes('multipart/form-data'),
		ApiResponse({
			description: '멤버 프로필 업로드',
			isArray: true,
			type: String,
		}),
		ApiBadRequestResponse({
			description: ERROR_FILE_NOT_FOUND,
		}),
	);
};
