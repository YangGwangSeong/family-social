import {
	Controller,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import {
	PatchGroupEventUploadImageSwagger,
	PatchGroupUploadCoverImageSwagger,
	PatchScheduleUploadThumbnailImageSwagger,
	PatchUploadMemberCoverImageSwagger,
	PostUploadFeedMediasSwagger,
	PostUploadProfileSwagger,
} from '@/common/decorators/swagger/swagger-media.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { BadRequestServiceException } from '@/common/exception/service.exception';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { GroupMemberShipGuard } from '@/common/guards/group-membership.guard';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor';
import { parseUUIDPipeMessage } from '@/common/pipe-message/parse-uuid-pipe-message';
import { ERROR_FILE_NOT_FOUND } from '@/constants/business-error';
import {
	CreateBodyImageMulterOptions,
	CreateMemberCoverImageMulterOptions,
	CreateMemberProfileImageMulterOptions,
	createGroupCoverImageMulterOptions,
	createGroupEventImageMulterOptions,
	createScheduleThumbnailImageMulterOptions,
} from '@/utils/upload-media';

import { GroupsService } from '../groups/groups.service';
import { MembersService } from '../members/members.service';
import { SchedulesService } from '../schedules/schedules.service';

@UseInterceptors(LoggingInterceptor, TimeoutInterceptor)
@UseGuards(AccessTokenGuard)
@ApiTags('medias')
@Controller('medias')
export class MediasController {
	constructor(
		private readonly schedulesService: SchedulesService,
		private readonly groupsService: GroupsService,
		private readonly membersService: MembersService,
	) {}

	/**
	 * @summary 멤버 프로필 업로드
	 *
	 * @tag medias
	 * @param files 업로드 파일 배열
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 업로드 된 파일 배열
	 */
	@PostUploadProfileSwagger()
	@Post('/members/profile')
	@UseInterceptors(
		FilesInterceptor('files', 1, CreateMemberProfileImageMulterOptions()),
	)
	async postUploadProfile(@UploadedFiles() files: Express.MulterS3.File[]) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);
		return locations;
	}

	/**
	 * @summary 멤버 커버 이미지 업로드
	 *
	 * @tag medias
	 * @param files 업로드 파일 배열
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 업로드 된 파일 배열
	 */
	@PatchUploadMemberCoverImageSwagger()
	@Patch('/members/cover-image')
	@UseInterceptors(
		FilesInterceptor('files', 1, CreateMemberCoverImageMulterOptions()),
	)
	async pathUploadMemberCoverImage(
		@UploadedFiles() files: Express.MulterS3.File[],
		@CurrentUser('sub') sub: string,
	) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);

		await this.membersService.updateMemberCoverImage(sub, locations[0]);
		return locations;
	}

	/**
	 * @summary 피드 미디어 업로드
	 *
	 * @tag medias
	 * @param files 업로드 파일 배열
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 업로드 된 파일 배열
	 */
	@PostUploadFeedMediasSwagger()
	@Post('/feeds')
	@UseInterceptors(
		FilesInterceptor('files', 10, CreateBodyImageMulterOptions()),
	)
	async postUploadFeedMedias(@UploadedFiles() files: Express.MulterS3.File[]) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);
		return locations;
	}

	/**
	 * @summary 특정 스케줄 여행스케줄 썸네일 변경
	 *
	 * @tag medias
	 * @param scheduleId - 스케줄 아이디
	 * @param files - 업로드 파일
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns string[]
	 */
	@PatchScheduleUploadThumbnailImageSwagger()
	@Patch('/schedules/:scheduleId/thumbnail-image')
	@UseInterceptors(
		FilesInterceptor('files', 1, createScheduleThumbnailImageMulterOptions()),
	)
	async PatchScheduleUploadThumbnailImage(
		@UploadedFiles() files: Express.MulterS3.File[],
		@Param(
			'scheduleId',
			new ParseUUIDPipe({ exceptionFactory: parseUUIDPipeMessage }),
		)
		scheduleId: string,
	) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);

		await this.schedulesService.updateScheduleThumbnail(
			scheduleId,
			locations[0],
		);

		return locations;
	}

	/**
	 * @summary 특정 그룹 커버 이미지 변경
	 *
	 * @tag medias
	 * @param groupId 그룹 아이디
	 * @param files 업로드 파일
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns string[]
	 */
	@PatchGroupUploadCoverImageSwagger()
	@Patch('/groups/:groupId/cover-image')
	@UseGuards(GroupMemberShipGuard)
	@UseInterceptors(
		FilesInterceptor('files', 1, createGroupCoverImageMulterOptions()),
	)
	async PatchGroupUploadCoverImage(
		@UploadedFiles() files: Express.MulterS3.File[],
		@Param(
			'groupId',
			new ParseUUIDPipe({ exceptionFactory: parseUUIDPipeMessage }),
		)
		groupId: string,
	) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);

		await this.groupsService.updateGroupCoverImage(groupId, locations[0]);

		return locations;
	}

	/**
	 * @summary 특정 그룹 특정 이벤트 이미지 변경
	 *
	 * @tag medias
	 * @param files 업로드 파일
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns string[]
	 */
	@PatchGroupEventUploadImageSwagger()
	@UseGuards(GroupMemberShipGuard)
	@UseInterceptors(
		FilesInterceptor('files', 1, createGroupEventImageMulterOptions()),
	)
	@Patch('/groups/:groupId/events/image')
	async PatchGroupEventUploadImage(
		@UploadedFiles() files: Express.MulterS3.File[],
	) {
		if (!files?.length) {
			throw BadRequestServiceException(ERROR_FILE_NOT_FOUND);
		}
		const locations = files.map(({ location }) => location);

		return locations;
	}
}
