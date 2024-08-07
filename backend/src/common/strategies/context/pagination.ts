import { Injectable } from '@nestjs/common';
import {
	FindManyOptions,
	ObjectLiteral,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';

import { DefaultPaginationReqDto } from '@/models/dto/pagination/req/default-pagination-req.dto';

export interface PaginationStrategy<T extends ObjectLiteral> {
	paginate(
		dto: DefaultPaginationReqDto,
		repository: Repository<T>,
		overrideFindOptions: FindManyOptions<T>,
		path?: string,
	): Promise<any>;

	paginateQueryBuilder(
		dto: DefaultPaginationReqDto,
		query: SelectQueryBuilder<T>,
		path?: string,
	): Promise<any>;
}

@Injectable()
export class Pagination<T extends ObjectLiteral> {
	private strategy!: PaginationStrategy<T>;

	setStrategy(strategy: PaginationStrategy<T>) {
		this.strategy = strategy;
	}

	async paginate(
		dto: DefaultPaginationReqDto,
		repository: Repository<T>,
		overrideFindOptions: FindManyOptions<T> = {},
		path?: string,
	) {
		return await this.strategy.paginate(
			dto,
			repository,
			overrideFindOptions,
			path,
		);
	}

	async paginateQueryBuilder(
		dto: DefaultPaginationReqDto,
		query: SelectQueryBuilder<T>,
		path?: string,
	) {
		return await this.strategy.paginateQueryBuilder(dto, query, path);
	}
}
