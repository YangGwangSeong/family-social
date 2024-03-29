import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CommentGetListsResDto } from '../../comments/res/comment-get-lists-res.dto';
import { MediaResDto } from '../../media/res/media-res.dto';

export class FeedResDto {
	@ApiProperty({
		nullable: false,
	})
	feedId!: string;

	@ApiProperty({
		nullable: false,
	})
	contents!: string;

	@ApiProperty({
		nullable: false,
	})
	isPublic!: boolean;

	@ApiProperty({
		nullable: false,
	})
	groupId!: string;

	@ApiProperty({
		nullable: false,
	})
	groupName!: string;

	@ApiProperty({
		nullable: false,
	})
	memberId!: string;

	@ApiProperty({
		nullable: false,
	})
	username!: string;

	@ApiProperty({
		nullable: true,
	})
	myLike?: boolean;

	@ApiProperty({
		nullable: true,
	})
	sumLike?: number;

	@ApiPropertyOptional({
		nullable: true,
		type: [MediaResDto],
	})
	medias?: MediaResDto[];

	@ApiPropertyOptional({
		nullable: true,
		type: [CommentGetListsResDto],
	})
	comments?: CommentGetListsResDto[];
}
