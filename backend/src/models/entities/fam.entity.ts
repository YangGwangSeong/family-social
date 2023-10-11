import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './common/default.entity';
import { MemberEntity } from './member.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { GroupEntity } from './group.entity';

export type roleType = 'main' | 'user';

@Entity({ name: 'fam' })
export class FamEntity extends DefaultEntity {
	@Column({
		type: 'varchar',
		length: 30,
		nullable: false,
		default: 'user',
	})
	role!: roleType;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	@Column({
		type: 'boolean',
		nullable: false,
		default: false,
	})
	invitationAccepted!: boolean;

	@Column({ type: 'uuid', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	public readonly memberId!: string;

	@Column({ type: 'uuid', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	public readonly groupId!: string;

	@ManyToOne((type) => MemberEntity, (member) => member.memberGroups)
	@JoinColumn({ name: 'memberId', referencedColumnName: 'id' })
	member!: MemberEntity;

	@ManyToOne((type) => GroupEntity, (group) => group.groupByMemberGroups)
	@JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
	group!: GroupEntity;
}
