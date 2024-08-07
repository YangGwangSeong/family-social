import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
	EntityConflictException,
	EntityNotFoundException,
} from '@/common/exception/service.exception';
import {
	ERROR_DELETE_GROUP_MEMBER,
	ERROR_INVITED_GROUP_NOT_FOUND,
} from '@/constants/business-error';
import { FamInvitationsResDto } from '@/models/dto/fam/res/fam-invitations-res.dto';
import { FamResDto } from '@/models/dto/fam/res/fam-res.dto';
import { FamsRepository } from '@/models/repositories/fams.repository';
import {
	IFindInvitationByFamArgs,
	IUpdateFamInvitationAcceptArgs,
} from '@/types/args/fam';

@Injectable()
export class FamsService {
	constructor(private readonly famsRepository: FamsRepository) {}

	async createFamByMemberOfGroup(createFamArgs: {
		memberId: string;
		groupId: string;
	}): Promise<void> {
		const newFam = this.famsRepository.create({
			id: uuidv4(),
			...createFamArgs,
			role: 'user',
			invitationAccepted: false,
		});
		await this.famsRepository.createFam(newFam);
		//[TODO] 그룹 초대 notification
	}

	async updateFamInvitationAccept(
		updateFamInvitationAcceptArgs: IUpdateFamInvitationAcceptArgs,
	): Promise<FamResDto> {
		return await this.famsRepository.updateFamInvitationAccept({
			...updateFamInvitationAcceptArgs,
		});
	}

	async deleteFamByMemberOfGroup(deleteFamByMemberOfGroupArgs: {
		groupId: string;
		memberId: string;
		famId: string;
	}): Promise<void> {
		const status = await this.famsRepository.deleteFam({
			...deleteFamByMemberOfGroupArgs,
		});

		if (!status) throw EntityConflictException(ERROR_DELETE_GROUP_MEMBER);
	}

	async getInvitationsList({ memberId }: { memberId: string }): Promise<{
		list: FamInvitationsResDto[];
		count: number;
	}> {
		const [list, count] = await this.famsRepository.getInvitationsList({
			memberId,
		});

		return {
			list,
			count,
		};
	}

	async checkIfFamExists(
		findInvitationByFamArgs: IFindInvitationByFamArgs,
	): Promise<FamResDto> {
		const fam = await this.famsRepository.findInvitationByFam({
			...findInvitationByFamArgs,
		});

		if (!fam) {
			throw EntityNotFoundException(ERROR_INVITED_GROUP_NOT_FOUND);
		}

		return fam;
	}
}
