import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { TourContentTypeId } from '@/types/type';

export class TourHttpCommonResDto {
	@ApiProperty({
		nullable: false,
		description: '콘텐츠ID',
	})
	contentid!: string;

	@ApiProperty({
		nullable: false,
		description: '콘텐츠타입ID',
	})
	contenttypeid!: TourContentTypeId;

	@ApiProperty({
		nullable: false,
		description: '콘텐츠명(제목)',
	})
	title!: string;

	@ApiProperty({
		nullable: false,
		description: '전화번호',
	})
	tel!: string;

	@ApiProperty({
		nullable: false,
		description: '전화번호명',
	})
	telname!: string;

	@ApiProperty({
		nullable: false,
		description: '홈페이지주소',
	})
	homepage!: string;

	@ApiProperty({
		nullable: false,
		description: '대표이미지(원본)',
	})
	firstimage!: string;

	@ApiProperty({
		nullable: false,
		description: '대표이미지(썸네일)',
	})
	firstimage2!: string;

	@ApiProperty({
		nullable: false,
		description: '지역코드',
	})
	areacode!: string;

	@ApiProperty({
		nullable: false,
		description: '시군구코드',
	})
	sigungucode!: string;

	@ApiProperty({
		nullable: false,
		description: '대분류',
	})
	cat1!: string;

	@ApiProperty({
		nullable: false,
		description: '중분류',
	})
	cat2!: string;

	@ApiProperty({
		nullable: false,
		description: '소분류',
	})
	cat3!: string;

	@ApiProperty({
		nullable: false,
		description: '주소',
	})
	addr1!: string;

	@ApiProperty({
		nullable: false,
		description: '상세주소',
	})
	addr2!: string;

	@ApiProperty({
		nullable: false,
		description: '우편번호',
	})
	zipcode!: string;

	@ApiProperty({
		nullable: false,
		description: '개요',
	})
	overview!: string;

	/**
	 * 등록일
	 */
	@Exclude({
		toPlainOnly: true,
	})
	createdtime!: string;

	/**
	 * 수정일
	 */
	@Exclude({
		toPlainOnly: true,
	})
	modifiedtime!: string;

	/**
	 * 교과서여행지여부
	 */
	@Exclude({
		toPlainOnly: true,
	})
	booktour!: string;

	/**
	 * 저작권 유형 (Type1:제1유형(출처표시-권장), Type3:제3유형(제1유형+변경금지)
	 */
	@Exclude({
		toPlainOnly: true,
	})
	cpyrhtDivCd!: string;

	/**
	 * GPS X좌표
	 */
	@Exclude({
		toPlainOnly: true,
	})
	mapx!: string;

	/**
	 * GPS Y좌표
	 */
	@Exclude({
		toPlainOnly: true,
	})
	mapy!: string;

	/**
	 * Map Level
	 */
	@Exclude({
		toPlainOnly: true,
	})
	mlevel!: string;

	@ApiProperty({
		nullable: false,
		description: '전체 주소',
		type: String,
	})
	@Expose({
		toPlainOnly: true,
	})
	get fullAddr() {
		return `(${this.areacode}) ${this.addr1} ${this.addr2}`;
	}
}
