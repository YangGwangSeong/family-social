import { Injectable } from '@nestjs/common';

import { ChatCreateReqDto } from '@/models/dto/chat/req/chat-create-req.dto';
import { GetChatListResDto } from '@/models/dto/chat/res/get-chat-list-res.dto';
import { MemberBelongToChatsResDto } from '@/models/dto/member-chat/res/member-belong-to-chats-res.dto';
import { ChatsRepository } from '@/models/repositories/chats.repository';
import { MemberChatRepository } from '@/models/repositories/member-chat.repository';

@Injectable()
export class ChatsService {
	constructor(
		private readonly chatsRepository: ChatsRepository,
		private readonly memberChatRepository: MemberChatRepository,
	) {}

	async getMemberBelongToChats(memberId: string): Promise<GetChatListResDto> {
		const chat = await this.memberChatRepository.getMemberBelongToChats(
			memberId,
		);

		const result = await Promise.all(
			chat.map(async (item): Promise<MemberBelongToChatsResDto> => {
				const [chatMembers, joinMemberCount] =
					await this.memberChatRepository.getMembersAndCountByChat(
						item.chat.id,
					);
				return {
					targetMemberId: item.memberId,
					chatId: item.chat.id,
					chatCreateAt: item.chat.createdAt.toISOString(),
					chatMembers,
					joinMemberCount,
				};
			}),
		);

		return {
			list: result,
		};
	}

	async createChat(dto: ChatCreateReqDto) {
		const chatId = await this.chatsRepository.createChat();

		await this.memberChatRepository.createMembersEnteredByChat(
			chatId.id,
			dto.memberIds,
		);
		return chatId;
	}

	async checkIfChatExists(chatId: string) {
		const exists = await this.chatsRepository.exist({
			where: {
				id: chatId,
			},
		});

		return exists;
	}
}
