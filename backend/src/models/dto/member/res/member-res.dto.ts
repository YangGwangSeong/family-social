import { PickType } from '@nestjs/swagger';

import { MemberEntity } from '@/models/entities/member.entity';

export class MemberResDto extends PickType(MemberEntity, [
	'username',
	'id',
] as const) {}

//userProfileUrl
