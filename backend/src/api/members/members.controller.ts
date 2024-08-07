import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
	GetMemberByEmailSwagger,
	GetMemberByMemberIdSwagger,
	GetMembersSwagger,
	UpdateMemberProfileSwagger,
} from '@/common/decorators/swagger/swagger-member.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { UnAuthOrizedException } from '@/common/exception/service.exception';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor';
import { parseUUIDPipeMessage } from '@/common/pipe-message/parse-uuid-pipe-message';
import { ParseEmailPipe } from '@/common/pipes/parse-email.pipe';
import { ERROR_AUTHORIZATION_MEMBER } from '@/constants/business-error';
import { MemberUpdateReqDto } from '@/models/dto/member/req/member-update-req.dto';

import { MembersService } from './members.service';

@UseInterceptors(LoggingInterceptor, TimeoutInterceptor)
@UseGuards(AccessTokenGuard)
@ApiTags('members')
@Controller('members')
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	/**
	 * @summary 내가 속한 그룹의 멤버들 전체 가져오기
	 *
	 * @tag members
	 * @param sub 인증된 유저
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 유저 이름 , 유저 아이디
	 */
	@GetMembersSwagger()
	@Get()
	async getMembers(@CurrentUser('sub') sub: string) {
		const { groupIds } = await this.membersService.findGroupIdsBelongToMyGroup(
			sub,
		);

		return await this.membersService.findAllMembers(sub, groupIds);
	}

	/**
	 * @summary 특정 멤버 유저 아이디로 조회
	 *
	 * @tag members
	 * @param memberId   		- 조회 대상 유저 아이디
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 유저 이름 , 유저 아이디
	 */
	@GetMemberByMemberIdSwagger()
	@Get(':memberId')
	async getMemberByMemberId(
		@Param(
			'memberId',
			new ParseUUIDPipe({ exceptionFactory: parseUUIDPipeMessage }),
		)
		memberId: string,
	) {
		return this.membersService.findMemberByIdOrThrow(memberId);
	}

	/**
	 * @summary 특정 멤버 유저 이메일로 조회
	 *
	 * @tag members
	 * @param email 조회 대상 유저 이메일
	 * @param sub 인증된 유저 아이디
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns 이름, 아이디, 프로필, 자기자신인지, 휴대폰 번호
	 */
	@GetMemberByEmailSwagger()
	@Get('email/:email')
	async getMemberByEmail(
		@Param('email', new ParseEmailPipe()) email: string,
		@CurrentUser('sub') sub: string,
	) {
		return await this.membersService.findOneMemberByEmail(email, sub);
	}

	/**
	 * @summary 계정 정보 수정 api 추가
	 *
	 * @tag members
	 * @param {string} memberId   		- 수정 할 memberId
	 * @param {string} dto.username   	- 유저이름
	 * @param {string} dto.phoneNumber  - 휴대폰 번호
	 * @param {string} dto.profileImage - 프로필 이미지 url
	 * @author YangGwangSeong <soaw83@gmail.com>
	 * @returns void
	 */
	@UpdateMemberProfileSwagger()
	@Put(':memberId')
	async updateMemberProfile(
		@Body() dto: MemberUpdateReqDto,
		@Param(
			'memberId',
			new ParseUUIDPipe({ exceptionFactory: parseUUIDPipeMessage }),
		)
		memberId: string,
		@CurrentUser('sub') sub: string,
	) {
		if (sub !== memberId)
			throw UnAuthOrizedException(ERROR_AUTHORIZATION_MEMBER);

		return await this.membersService.updateMemberProfile({
			memberId,
			...dto,
		});
	}
}
