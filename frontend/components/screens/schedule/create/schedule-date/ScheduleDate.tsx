import React, { FC, useEffect, useState } from 'react';
import styles from './ScheduleDate.module.scss';
import Field from '@/components/ui/field/Field';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import CustomButton from '@/components/ui/button/custom-button/CustomButton';
import { TranslateDateFormat } from '@/utils/translate-date-format';
import { getDateRange } from '@/utils/get-date-range';
import { useRecoilState } from 'recoil';
import { selectedPeriodAtom } from '@/atoms/selectedPeriodAtom';
import { PeriodsType } from '@/atoms/periodAtom';
import { ScheduleDateProps } from './schedule-date.interface';

const ScheduleDate: FC<ScheduleDateProps> = ({
	handleChangePage,
	onChangeScheduleName,
	isScheduleName,
	onChangePeriods,
	handleChangeDate,
	startDate,
	endDate,
	isPeriodTimes,
	selectedDates,
}) => {
	const handleChangeScheduleName = (name: string) => {
		onChangeScheduleName(name);
	};

	useEffect(() => {
		if (isPeriodTimes.length > 0) {
			onChangePeriods(isPeriodTimes);
		}
	}, [isPeriodTimes, onChangePeriods]);

	return (
		<div className={styles.main_container}>
			<div className={styles.contents_container}>
				<div className={styles.step_title}>STEP 2</div>

				<div>
					<div className={styles.schedule_name_container}>
						<div className={styles.title}>여행 이름</div>
						<div>
							<Field
								onChange={e => handleChangeScheduleName(e.target.value)}
								defaultValue={isScheduleName}
								placeholder="여행 이름을 작성해주세요."
							></Field>
						</div>
					</div>
					<div className={styles.title}>여행 일정 선택</div>
					<div>여행 기간이 어떻게 되시나요?</div>
					<DatePicker
						locale={ko}
						selectsRange={true}
						startDate={startDate}
						endDate={endDate}
						onChange={handleChangeDate}
						inline
						isClearable={true}
					/>
				</div>
			</div>
			<div className={styles.button_container}>
				<CustomButton
					type="button"
					className="mt-8 mb-4 bg-white text-customDark 
							font-bold border border-solid border-customDark 
							rounded-full p-[10px] w-full hover:opacity-80"
					onClick={() => handleChangePage('selectGroupPage')}
				>
					이전
				</CustomButton>
				<CustomButton
					type="button"
					className="mt-8 mb-4 bg-customOrange text-customDark 
					font-bold border border-solid border-customDark 
					rounded-full p-[10px]
					w-full hover:bg-orange-500
					"
					onClick={selectedDates}
				>
					{`다음`}
				</CustomButton>
			</div>
		</div>
	);
};

export default ScheduleDate;
