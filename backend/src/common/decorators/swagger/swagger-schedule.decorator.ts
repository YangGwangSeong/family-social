import { applyDecorators } from '@nestjs/common';
import {
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOperation,
} from '@nestjs/swagger';

import {
	ERROR_GROUP_NOT_FOUND,
	ERROR_NO_PERMISSTION_TO_GROUP,
	ERROR_NO_PERMISSTION_TO_SCHEDULE,
	ERROR_SCHEDULE_NOT_FOUND,
} from '@/constants/business-error';
import { ScheduleByIdResDto } from '@/models/dto/schedule/res/schedule-by-id-res.dto';
import { ScheduleResDto } from '@/models/dto/schedule/res/schedule-res.dto';

export const GetOneScheduleSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '특정 여행일정 가져오기',
		}),
		ApiCreatedResponse({
			description: '특정 여행일정 가져오기',
			type: ScheduleResDto,
		}),
		ApiNotFoundResponse({
			description: `1. ${ERROR_GROUP_NOT_FOUND} \n2. ${ERROR_SCHEDULE_NOT_FOUND}`,
		}),
		ApiForbiddenResponse({
			description: ERROR_NO_PERMISSTION_TO_GROUP,
		}),
	);
};

export const GetScheduleListSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '여행일정 리스트 전체 가져오기',
		}),
		ApiCreatedResponse({
			description: '여행일정 리스트 전체 가져오기',
			type: ScheduleResDto,
		}),
		ApiNotFoundResponse({
			description: `${ERROR_GROUP_NOT_FOUND}`,
		}),
		ApiForbiddenResponse({
			description: ERROR_NO_PERMISSTION_TO_GROUP,
		}),
	);
};

export const CreateToursScheduleSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '특정 그룹의 여행 일정 작성하기',
		}),
		ApiCreatedResponse({
			description: '여행 일정 생성 성공',
			type: ScheduleByIdResDto,
		}),
		ApiNotFoundResponse({
			description: `${ERROR_GROUP_NOT_FOUND}`,
		}),
		ApiForbiddenResponse({
			description: ERROR_NO_PERMISSTION_TO_GROUP,
		}),
	);
};

export const UpdateToursScheduleSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '특정 그룹의 여행 일정 수정하기',
		}),
		ApiCreatedResponse({
			description: '여행 일정 수정 성공',
			type: ScheduleByIdResDto,
		}),
		ApiNotFoundResponse({
			description: `1. ${ERROR_GROUP_NOT_FOUND} \n2. ${ERROR_SCHEDULE_NOT_FOUND}`,
		}),
		ApiForbiddenResponse({
			description: `1. ${ERROR_NO_PERMISSTION_TO_GROUP} \n2. ${ERROR_NO_PERMISSTION_TO_SCHEDULE}`,
		}),
	);
};

export const DeleteToursScheduleSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '특정 그룹의 여행 일정 삭제하기',
		}),
		ApiCreatedResponse({
			description: '여행 일정 삭제 성공',
		}),
		ApiNotFoundResponse({
			description: `1. ${ERROR_GROUP_NOT_FOUND} \n2. ${ERROR_SCHEDULE_NOT_FOUND}`,
		}),
		ApiForbiddenResponse({
			description: `1. ${ERROR_NO_PERMISSTION_TO_GROUP} \n2. ${ERROR_NO_PERMISSTION_TO_SCHEDULE}`,
		}),
	);
};

export const PatchScheduleTitleSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '특정 스케줄 여행제목 수정',
		}),
		ApiCreatedResponse({
			description: '여행 제목 수정 성공',
		}),
		ApiNotFoundResponse({
			description: `${ERROR_SCHEDULE_NOT_FOUND}`,
		}),
	);
};

export const PatchScheduleUploadThumbnailImageSwagger = () => {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
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
		ApiOperation({
			summary: '특정 스케줄 썸네일 수정하기',
		}),
		ApiCreatedResponse({
			description: '스케줄 썸네일 수정하기 성공',
		}),
		ApiNotFoundResponse({
			description: `${ERROR_SCHEDULE_NOT_FOUND}`,
		}),
	);
};
