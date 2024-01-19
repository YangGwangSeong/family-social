import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleEntity } from '@/models/entities/schedule.entity';
import { TourismPeriodEntity } from '@/models/entities/tourism-period.entity';
import { TourismEntity } from '@/models/entities/tourism.entity';
import { ScheduleRepository } from '@/models/repositories/schedule.repository';
import { TourismPeriodRepository } from '@/models/repositories/tourism-period.repository';
import { TourismRepository } from '@/models/repositories/tourism.repository';

import { SchedulesService } from './schedules.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ScheduleEntity,
			TourismPeriodEntity,
			TourismEntity,
		]),
	],
	controllers: [],
	providers: [
		SchedulesService,
		ScheduleRepository,
		TourismPeriodRepository,
		TourismRepository,
	],
	exports: [SchedulesService],
})
export class SchedulesModule {}
