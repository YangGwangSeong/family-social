import { FamEntity } from '@/entities/fam.entity';
import { IDeleteGroupArgs } from '@/types/args/group';
import {
	ICreateMemberGroupArgs,
	IUpdateGroupMemberInvitationAccept,
} from '@/types/args/member-group';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FamsRepository extends Repository<FamEntity> {
	constructor(
		@InjectRepository(FamEntity)
		private readonly repository: Repository<FamEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async isMainRoleForMemberInGroup({ groupId, memberId }: IDeleteGroupArgs) {
		const role = await this.repository.findOneOrFail({
			select: {
				role: true,
			},
			where: {
				groupId: groupId,
				memberId: memberId,
			},
		});

		return role;
	}

	async getMemberGroupCountByGroupId({ groupId }: { groupId: string }) {
		const memberGroup = await this.repository.count({
			where: {
				groupId: groupId,
				invitationAccepted: true,
			},
		});

		return memberGroup;
	}

	async findMemberGroupById({
		memberGroupId,
		memberId,
	}: {
		memberGroupId: string;
		memberId: string;
	}) {
		const memberGroup = await this.repository.findOne({
			where: {
				id: memberGroupId,
				memberId: memberId,
			},
			select: {
				id: true,
			},
		});

		return memberGroup;
	}

	async findOrFailMemberGroupById({
		memberGroupId,
	}: {
		memberGroupId: string;
	}) {
		const memberGroup = await this.repository.findOneOrFail({
			where: {
				id: memberGroupId,
			},
			select: {
				id: true,
			},
		});

		return memberGroup;
	}

	async createMemberGroup({
		memberId,
		groupId,
		role,
		invitationAccepted,
	}: ICreateMemberGroupArgs) {
		const insertResult = await this.repository.insert({
			id: uuidv4(),
			memberId: memberId,
			groupId: groupId,
			role: role,
			invitationAccepted: invitationAccepted,
		});

		const id: string = insertResult.identifiers[0].id;

		return this.findOrFailMemberGroupById({ memberGroupId: id });
	}

	async updateGroupMemberInvitationAccept({
		memberId,
		memberGroupId,
		invitationAccepted,
	}: IUpdateGroupMemberInvitationAccept) {
		await this.update(
			{ id: memberGroupId, memberId: memberId },
			{ invitationAccepted: invitationAccepted },
		);
	}

	async deleteGroupAllMember({ groupId }: { groupId: string }) {
		const { affected } = await this.delete({
			groupId: groupId,
		});

		return !!affected;
	}

	async deleteGroupMemberByMemberGroupId({
		groupMemberId,
	}: {
		groupMemberId: string;
	}) {
		const { affected } = await this.delete({
			id: groupMemberId,
		});

		return !!affected;
	}
}
