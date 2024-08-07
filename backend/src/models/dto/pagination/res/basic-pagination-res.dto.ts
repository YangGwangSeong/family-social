import { mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

type Constructor<T = object> = new (...args: any[]) => T;

export function withBasicPaginationResponse<T extends Constructor>(Base: T) {
	class BasicPaginationResDto {
		@ApiProperty({
			nullable: false,
			type: [Base],
		})
		@Type(() => Base)
		list!: T[];

		@ApiProperty({
			nullable: false,
			description: '페이지 번호',
		})
		page!: number;

		@ApiProperty({
			nullable: false,
			description: '총 페이지',
		})
		totalPage!: number;
	}

	return mixin(BasicPaginationResDto);
}

export type ReturnBasicPaginationType<T extends Constructor> = ReturnType<
	typeof withBasicPaginationResponse<T>
>;
