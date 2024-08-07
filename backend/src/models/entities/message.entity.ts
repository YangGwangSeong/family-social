import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { notEmptyValidationMessage } from '@/common/validation-message/not-empty-validation-message';
import { stringValidationMessage } from '@/common/validation-message/string-validation-message';
import { uuidValidationMessage } from '@/common/validation-message/uuid-validation-message';

import { ChatEntity } from './chat.entity';
import { DefaultEntity } from './common/default.entity';
import { MemberEntity } from './member.entity';

@Entity({ name: 'fam_message' })
@Index(['createdAt'])
@Index(['updatedAt'])
@Index(['chatId'])
export class MessageEntity extends DefaultEntity {
	@Column({ type: 'uuid', nullable: false })
	@ApiProperty({
		description: '메세지에 해당하는 채팅방 아이디',
	})
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsUUID(4, { message: uuidValidationMessage })
	public readonly chatId!: string;

	@Column({ type: 'uuid', nullable: false })
	@ApiProperty({
		description: '메세지에 작성자 아이디',
	})
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsUUID(4, { message: uuidValidationMessage })
	public readonly memberId!: string;

	@ApiProperty({
		nullable: false,
		description: '메세지 내용',
	})
	@IsNotEmpty({
		message: notEmptyValidationMessage,
	})
	@IsString({
		message: stringValidationMessage,
	})
	@Column({ type: 'text', nullable: false })
	message!: string;

	@ManyToOne(() => ChatEntity, (chat) => chat.messages)
	@JoinColumn({ name: 'chatId', referencedColumnName: 'id' })
	chat!: ChatEntity;

	@ManyToOne(() => MemberEntity, (mb) => mb.messages)
	@JoinColumn({ name: 'memberId', referencedColumnName: 'id' })
	member!: MemberEntity;
}
