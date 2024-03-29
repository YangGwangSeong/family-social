import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ICreateScheduleArgs } from '@/types/args/schedule';

import { ScheduleByIdResDto } from '../dto/schedule/res/schedule-by-id-res.dto';
import { ScheduleGetListResDto } from '../dto/schedule/res/schedule-get-list-res.dto';
import { ScheduleItemResDto } from '../dto/schedule/res/schedule-item-res.dto';
import { ScheduleEntity } from '../entities/schedule.entity';

@Injectable()
export class ScheduleRepository extends Repository<ScheduleEntity> {
	constructor(
		@InjectRepository(ScheduleEntity)
		private readonly repository: Repository<ScheduleEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	getScheduleRepository(qr?: QueryRunner) {
		return qr
			? qr.manager.getRepository<ScheduleEntity>(ScheduleEntity)
			: this.repository;
	}

	async getScheduleListOwnMemberId({
		memberId,
		take,
		skip,
	}: {
		memberId: string;
		take: number;
		skip: number;
	}): Promise<[ScheduleGetListResDto[], number]> {
		return await this.repository.findAndCount({
			select: {
				id: true,
				groupId: true,
				scheduleImage: true,
				scheduleName: true,
				startPeriod: true,
				endPeriod: true,
				updatedAt: true,
			},
			where: {
				memberId,
			},
			relations: {
				schedulePeriods: {
					tourisms: true,
				},
			},
			order: {
				updatedAt: 'desc',
			},
			take,
			skip,
		});
	}

	async getOneScheduleById(
		scheduleId: string,
	): Promise<ScheduleItemResDto | null> {
		return await this.repository.findOne({
			select: {
				id: true,
				groupId: true,
				scheduleImage: true,
				scheduleName: true,
				startPeriod: true,
				endPeriod: true,
				updatedAt: true,
				schedulePeriods: {
					id: true,
					period: true,
					startTime: true,
					endTime: true,
					tourisms: {
						id: true,
						contentId: true,
						stayTime: true,
						tourismImage: true,
						title: true,
						position: true,
					},
				},
			},
			where: {
				id: scheduleId,
			},
			relations: {
				schedulePeriods: {
					tourisms: true,
				},
			},
			order: {
				updatedAt: 'desc',
				schedulePeriods: {
					period: 'ASC',
					tourisms: {
						position: 'ASC',
					},
				},
			},
		});
	}

	async findOrFailScheduleById(
		{
			scheduleId,
		}: {
			scheduleId: string;
		},
		qr?: QueryRunner,
	): Promise<ScheduleByIdResDto> {
		const scheduleRepository = this.getScheduleRepository(qr);

		const schedule = await scheduleRepository.findOneOrFail({
			where: {
				id: scheduleId,
			},
			select: {
				id: true,
			},
		});

		return schedule;
	}

	async findScheduleById(
		scheduleId: string,
	): Promise<ScheduleByIdResDto | null> {
		const schedule = await this.repository.findOne({
			where: {
				id: scheduleId,
			},
			select: {
				id: true,
			},
		});

		return schedule;
	}

	async createSchedule(
		createScheduleArgs: ICreateScheduleArgs,
		qr?: QueryRunner,
	) {
		const scheduleRepository = this.getScheduleRepository(qr);

		const insertResult = await scheduleRepository.insert({
			id: uuidv4(),
			...createScheduleArgs,
		});

		const id: string = insertResult.identifiers[0].id;

		return this.findOrFailScheduleById({ scheduleId: id }, qr);
	}

	async updateScheduleGroup(
		{
			memberId,
			groupId,
			scheduleId,
		}: {
			memberId: string;
			groupId: string;
			scheduleId: string;
		},
		qr?: QueryRunner,
	) {
		const scheduleRepository = this.getScheduleRepository(qr);

		await scheduleRepository.update({ id: scheduleId, memberId }, { groupId });

		return this.findOrFailScheduleById({ scheduleId: scheduleId }, qr);
	}

	async updateScheduleTitleById(scheduleId: string, scheduleName: string) {
		await this.update({ id: scheduleId }, { scheduleName });
	}

	async updateScheduleThumbnail(scheduleId: string, imageUrl: string) {
		await this.update({ id: scheduleId }, { scheduleImage: imageUrl });
	}

	async deleteSchedule(scheduleId: string, qr?: QueryRunner): Promise<boolean> {
		const scheduleRepository = this.getScheduleRepository(qr);

		const { affected } = await scheduleRepository.delete({
			id: scheduleId,
		});

		return !!affected;
	}

	async findOwnSchedule(
		scheduleId: string,
		memberId: string,
	): Promise<ScheduleByIdResDto | null> {
		return await this.repository.findOne({
			select: {
				id: true,
			},
			where: {
				id: scheduleId,
				memberId,
			},
		});
	}
}
