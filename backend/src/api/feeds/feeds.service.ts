import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

import {
	EntityConflictException,
	EntityNotFoundException,
} from '@/common/exception/service.exception';
import {
	ERROR_DELETE_FEED_OR_MEDIA,
	ERROR_FEED_NOT_FOUND,
	ERROR_FILE_DIR_NOT_FOUND,
} from '@/constants/business-error';
import { FeedByIdResDto } from '@/models/dto/feed/res/feed-by-id-res.dto';
import { FeedGetAllResDto } from '@/models/dto/feed/res/feed-get-all-res.dto';
import { FeedResDto } from '@/models/dto/feed/res/feed-res.dto';
import { FeedsRepository } from '@/models/repositories/feeds.repository';
import { LikesFeedRepository } from '@/models/repositories/likes-feed.repository';
import { ICreateFeedArgs, IUpdateFeedArgs } from '@/types/args/feed';
import { extractFilePathFromUrl } from '@/utils/extract-file-path';
import { getOffset } from '@/utils/getOffset';
import { DeleteS3Media } from '@/utils/upload-media';

import { CommentsService } from '../comments/comments.service';
import { MediasService } from '../medias/medias.service';

@Injectable()
export class FeedsService {
	constructor(
		private readonly feedsRepository: FeedsRepository,
		private readonly mediasService: MediasService,
		private readonly commentsService: CommentsService,
		private readonly likesFeedRepository: LikesFeedRepository,
		private dataSource: DataSource,
	) {}

	async findFeedInfoById(feedIdArgs: string): Promise<FeedResDto> {
		const [feed, medias] = await Promise.all([
			await this.feedsRepository.findFeedInfoById(feedIdArgs),
			await this.mediasService.findMediaUrlByFeedId(feedIdArgs),
		]);

		const { id: feedId, group, member, ...feedRest } = feed;
		const { id: groupId, ...groupRest } = group;
		const { id: memberId, ...memberRest } = member;

		return {
			feedId,
			...feedRest,
			groupId,
			...groupRest,
			memberId,
			...memberRest,
			medias,
		};
	}

	async findAllFeed(
		page: number,
		memberId: string,
		options: 'TOP' | 'MYFEED' | 'ALL',
	): Promise<FeedGetAllResDto> {
		const { take, skip } = getOffset({ page });
		const { list, count } = await this.feedsRepository.findAllFeed({
			take,
			skip,
			memberId,
			options,
		});

		const mappedList = await Promise.all(
			list.map(async (feed) => {
				const [medias, comments] = await this.getMediaUrlAndCommentsByFeedId(
					feed.feedId,
					memberId,
				);

				return {
					...feed,
					medias: medias,
					comments: comments,
				};
			}),
		);

		return {
			list: mappedList,
			page: page,
			totalPage: Math.ceil(count / take),
		};
	}

	async updateLikesFeedId(memberId: string, feedId: string): Promise<boolean> {
		const like = await this.likesFeedRepository.findMemberLikesFeed(
			memberId,
			feedId,
		);

		if (like) {
			await this.likesFeedRepository.remove(like);
		} else {
			await this.likesFeedRepository.save({ memberId, feedId });
		}

		return !like;
	}

	async createFeed(
		{ medias, ...rest }: ICreateFeedArgs,
		qr?: QueryRunner,
	): Promise<FeedByIdResDto> {
		const feed = await this.feedsRepository.createFeed(
			{
				...rest,
			},
			qr,
		);

		await this.mediasService.createFeedMedias(medias, feed.id, qr);

		return feed;
	}

	async updateFeed({ medias, ...rest }: IUpdateFeedArgs, qr?: QueryRunner) {
		const feed = await this.feedsRepository.updateFeed(
			{
				...rest,
			},
			qr,
		);

		await this.mediasService.updateFeedMedias(medias, rest.feedId, qr);

		return feed;
	}

	async deleteFeed(feedId: string, qr?: QueryRunner) {
		const [mediaStatus, feedStatus] = await Promise.all([
			await this.mediasService.deleteFeedMediasByFeedId(feedId, qr),
			await this.feedsRepository.deleteFeed(feedId, qr),
		]);

		if (!mediaStatus || !feedStatus)
			throw EntityConflictException(ERROR_DELETE_FEED_OR_MEDIA);

		const medias = await this.mediasService.findMediaUrlByFeedId(feedId);
		medias.map(async (media) => {
			const fileName = extractFilePathFromUrl(media.url, 'feed');
			if (!fileName) throw EntityNotFoundException(ERROR_FILE_DIR_NOT_FOUND);
			await DeleteS3Media(fileName);
		});
	}

	async findFeedByIdOrThrow(feedId: string): Promise<FeedByIdResDto> {
		const feed = await this.feedsRepository.findFeedById(feedId);

		if (!feed) {
			throw EntityNotFoundException(ERROR_FEED_NOT_FOUND);
		}

		return feed;
	}

	async isMineFeedExists(feedId: string, memberId: string): Promise<boolean> {
		return await this.feedsRepository.exist({
			where: {
				id: feedId,
				memberId,
			},
		});
	}

	private async getMediaUrlAndCommentsByFeedId(
		feedId: string,
		memberId: string,
	) {
		return await Promise.all([
			await this.mediasService.findMediaUrlByFeedId(feedId),
			await this.commentsService.getCommentsByFeedId(feedId, memberId),
		]);
	}
}
