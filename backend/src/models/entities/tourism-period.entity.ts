import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './common/default.entity';
import { ScheduleEntity } from './schedule.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

@Entity({ name: 'fam_tourism_period' })
export class TourismPeriodEntity extends DefaultEntity {
	@Column({ type: 'date', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	period!: Date;

	@Column({ type: 'time', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	startTime!: Date;

	@Column({ type: 'time', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	endTime!: Date;

	@Column({ type: 'uuid', nullable: false })
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	public readonly scheduleId!: string;

	@ManyToOne((type) => ScheduleEntity, (sch) => sch.schdulePeriods)
	@JoinColumn({ name: 'scheduleId', referencedColumnName: 'id' })
	schedule!: ScheduleEntity;
}
