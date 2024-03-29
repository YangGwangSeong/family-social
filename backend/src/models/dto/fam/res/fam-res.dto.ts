import { PickType } from '@nestjs/swagger';

import { FamEntity } from '@/models/entities/fam.entity';

export class FamResDto extends PickType(FamEntity, [
	'id',
	'invitationAccepted',
] as const) {}
