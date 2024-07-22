import { useTourAdditionalExplanation } from '@/hooks/useTourAdditionalExplanation';
import { TourIntroductionUnionType } from '@/shared/interfaces/tour.interface';
import { isAdditionalCommon, isShopping } from '@/utils/type-guard';
import React, { FC } from 'react';

// 쇼핑 (38)
const TourShopping: FC<{ list: TourIntroductionUnionType }> = ({ list }) => {
	const { data } = useTourAdditionalExplanation();

	return (
		<>
			{isShopping(list) &&
				list.list.map((item, index) => <div key={index}>{item.fairday}</div>)}

			{data &&
				isAdditionalCommon(data) &&
				data.list.length > 0 &&
				data.list.map((item, index) => <div key={index}>{item.infoname}</div>)}
		</>
	);
};

export default TourShopping;
