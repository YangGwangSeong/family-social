import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { EntityNotFoundException } from '@/common/exception/service.exception';
import { ERROR_GROUP_EVENT_TYPE_NOT_FOUND } from '@/constants/business-error';
import { GroupEventTypeRepository } from '@/models/repositories/group-event-type.repository';
import { GroupEventRepository } from '@/models/repositories/group-event.repository';
import { EventType, Union } from '@/types';
import { ICreateGroupEventArgs } from '@/types/args/group-event';
@Injectable()
export class GroupEventsService {
	constructor(
		private readonly groupEventRepository: GroupEventRepository,
		private readonly groupEventTypeRepository: GroupEventTypeRepository,
	) {}

	async createGroupEvent(
		createGroupEventArgs: ICreateGroupEventArgs,
		eventOrganizerId: string,
		qr?: QueryRunner,
	) {
		const { eventType } = createGroupEventArgs;

		if (!this.isEventTypeExists(eventType))
			throw EntityNotFoundException(ERROR_GROUP_EVENT_TYPE_NOT_FOUND);

		const newGroupEvent = this.groupEventRepository.create({
			id: uuidv4(),
			...createGroupEventArgs,
			eventOrganizerId,
		});

		await this.groupEventRepository.createGroupEvent(newGroupEvent, qr);
	}

	private async isEventTypeExists(
		eventType: Union<typeof EventType>,
	): Promise<boolean> {
		return await this.groupEventTypeRepository.exist({
			where: {
				groupEventType: eventType,
			},
		});
	}
}
