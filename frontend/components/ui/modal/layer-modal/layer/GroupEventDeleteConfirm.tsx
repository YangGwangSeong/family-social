import React, { FC } from 'react';
import LayerModalVariantWrapper from './LayerModalVariantWrapper';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import CustomButton from '@/components/ui/button/custom-button/CustomButton';
import { useRecoilState } from 'recoil';
import { modalAtom } from '@/atoms/modalAtom';
import {
	groupEventIdAtom,
	groupEventIdAtomDefaultValue,
} from '@/atoms/groupEventIdAtom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { GroupEventService } from '@/services/group-event/group-event.service';
import { useSuccessLayerModal } from '@/hooks/useSuccessLayerModal';
import { LayerMode } from 'types';

const GroupEventDeleteConfirm: FC = () => {
	const [, setIsShowing] = useRecoilState<boolean>(modalAtom);
	const [IsGroupEventId, setIsGroupEventId] = useRecoilState(groupEventIdAtom);

	const { handleSuccessLayerModal } = useSuccessLayerModal();

	const { mutate: deleteGroupEventSync } = useMutation(
		['delete-group-event'],
		() =>
			GroupEventService.deleteGroupEvent(
				IsGroupEventId.groupId,
				IsGroupEventId.groupEventId,
			),
		{
			onMutate: variable => {
				Loading.hourglass();
			},
			onSuccess(data) {
				Loading.remove();

				handleSuccessLayerModal({
					modalTitle: '이벤트 삭제 성공',
					layer: LayerMode.successLayerModal,
					lottieFile: 'deleteAnimation',
					message: '해당 이벤트를 삭제 하였습니다',
				});

				setIsGroupEventId(groupEventIdAtomDefaultValue);
			},
			onError(error) {
				if (axios.isAxiosError(error)) {
					Report.warning(
						'실패',
						`${error.response?.data.message}`,
						'확인',
						() => Loading.remove(),
					);
				}
			},
		},
	);

	const handleClick = () => {
		deleteGroupEventSync();
	};

	return (
		<LayerModalVariantWrapper>
			<div className="my-10 text-sm text-customGray">
				정말 해당 이벤트를 삭제하시겠습니까?
			</div>
			<div className="flex w-full gap-5">
				<CustomButton
					type="button"
					className="mt-8 mb-4 bg-customDark text-customOrange 
					font-bold border border-solid border-customDark 
					rounded-full p-[10px] w-full hover:opacity-80"
					onClick={handleClick}
				>
					삭제
				</CustomButton>

				<CustomButton
					type="button"
					className="mt-8 mb-4 bg-white text-customDark 
					font-bold border border-solid border-customDark 
					rounded-full p-[10px] w-full hover:bg-gray-200"
					onClick={() => setIsShowing(false)}
				>
					취소
				</CustomButton>
			</div>
		</LayerModalVariantWrapper>
	);
};

export default GroupEventDeleteConfirm;
