import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatMembersResDto } from '../dto/member-chat/res/chat-members-res.dto';
import { MemberBelongToChatsResDto } from '../dto/member-chat/res/member-belong-to-chats-res.dto';
import { MemberChatEntity } from '../entities/member-chat.entity';

@Injectable()
export class MemberChatRepository extends Repository<MemberChatEntity> {
	constructor(
		@InjectRepository(MemberChatEntity)
		private readonly repository: Repository<MemberChatEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async createMembersEnteredByChat(
		chatId: string,
		memberIds: string[],
	): Promise<void> {
		await this.repository.insert(
			memberIds.map((value) => {
				return {
					chatId,
					memberId: value,
				};
			}),
		);
	}

	async getMemberBelongToChats(
		memberId: string,
	): Promise<
		Omit<MemberBelongToChatsResDto, 'chatMembers' | 'joinMemberCount'>[]
	> {
		return await this.repository
			.find({
				select: {
					memberId: true,
					chat: {
						id: true,
						createdAt: true,
					},
				},
				where: {
					memberId,
				},
				relations: {
					chat: true,
				},
			})
			.then((data) => {
				return data.map((value) => {
					return {
						targetMemberId: value.memberId,
						chatId: value.chat.id,
						chatCreateAt: value.chat.createdAt.toISOString(),
					};
				});
			});
	}

	async getMembersAndCountByChat(
		chatId: string,
	): Promise<[ChatMembersResDto[], number]> {
		return await this.repository.findAndCount({
			select: {
				memberId: true,
				member: {
					id: true,
					username: true,
					profileImage: true,
				},
			},
			where: {
				chatId,
			},
			relations: {
				member: true,
			},
		});
	}
}
