import { PickType } from '@nestjs/swagger';

import { CommentEntity } from '@/models/entities/comment.entity';

export class CommentCreateReqDto extends PickType(CommentEntity, [
	'commentContents',
	'replyId',
	'parentId',
] as const) {}
