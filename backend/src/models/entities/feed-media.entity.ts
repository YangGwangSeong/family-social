import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';

import { notEmptyValidationMessage } from '@/common/validation-message/not-empty-validation-message';
import { numberValidationMessage } from '@/common/validation-message/number-validation-message';
import { stringValidationMessage } from '@/common/validation-message/string-validation-message';
import { uuidValidationMessage } from '@/common/validation-message/uuid-validation-message';

import { DefaultEntity } from './common/default.entity';
import { FeedEntity } from './feed.entity';

@Entity({ name: 'fam_feed_media' })
@Index(['createdAt'])
@Index(['updatedAt'])
export class FeedMediaEntity extends DefaultEntity {
	@PrimaryColumn('uuid')
	@ApiProperty()
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsUUID(4, { message: uuidValidationMessage })
	public readonly feedId!: string;

	/**
	 * 서버를 통해 한 번 전처리된 이미지
	 * example is @link {https://folder/test.jpg}
	 *
	 * @minLength 4
	 * @maxLength 2048
	 */
	@Column('varchar', { length: 2048 })
	@ApiProperty({
		description: '미디어 url 주소',
	})
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsString({
		message: stringValidationMessage,
	})
	url!: string;

	/**
	 * 미디어파일의 정렬 순서로, 오름차순 정렬된다.
	 */
	@Column('int4', { name: 'position', default: 0 })
	@ApiProperty()
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsNumber(
		{},
		{
			message: numberValidationMessage,
		},
	)
	position!: number;

	@ManyToOne(() => FeedEntity, (feed) => feed.medias)
	@JoinColumn({ name: 'feedId', referencedColumnName: 'id' })
	feed!: FeedEntity;
}
