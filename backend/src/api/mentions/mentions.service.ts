import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { v4 as uuidv4 } from 'uuid';

import { MentionCreateReqDto } from '@/models/dto/mention/req/mention-create-req.dto';
import { MentionEntity } from '@/models/entities/mention.entity';
import { MentionTypeRepository } from '@/models/repositories/mention-type.repository';
import { MentionsRepository } from '@/models/repositories/mentions.repository';
import { MentionType, Union } from '@/types';
import { ICreateMentionArgs } from '@/types/args/mention';

@Injectable()
export class MentionsService {
	constructor(
		private readonly mentionsRepository: MentionsRepository,
		private readonly mentionTypeRepository: MentionTypeRepository,
	) {}

	async findMentionsByFeedId(feedId: string) {
		return await this.mentionsRepository.getMentions({
			mentionFeedId: feedId,
		});
	}

	async findMentionIdByNotificationType(
		mentionType: Union<typeof MentionType>,
	) {
		const { mentionTypId } = await this.mentionTypeRepository.findMentionTypeId(
			mentionType,
		);

		return mentionTypId;
	}

	async createMentions(mentionArgs: ICreateMentionArgs, qr?: QueryRunner) {
		const { mentionType, mentions, ...rest } = mentionArgs;

		const mentionTypeId = await this.findMentionIdByNotificationType(
			mentionType,
		);

		await this.mentionsRepository.createMentions(
			this.createNewMentions(mentions, mentionTypeId, { ...rest }),
			qr,
		);
	}

	private createNewMentions(
		mentions: MentionCreateReqDto[],
		mentionTypeId: string,
		{
			mentionSenderId,
			mentionFeedId,
		}: { mentionSenderId: string; mentionFeedId: string },
	) {
		return mentions.map((data): QueryDeepPartialEntity<MentionEntity> => {
			return {
				id: uuidv4(),
				mentionTypeId,
				mentionSenderId,
				mentionFeedId,
				mentionRecipientId: data.mentionMemberId,
			};
		});
	}
}
