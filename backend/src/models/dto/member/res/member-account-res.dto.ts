import { PickType } from '@nestjs/swagger';

import { MemberEntity } from '@/models/entities/member.entity';

export class MemberAccountResDto extends PickType(MemberEntity, [
	'id',
	'username',
	'profileImage',
	'coverImage',
	'phoneNumber',
] as const) {
	isMine!: boolean;
}
