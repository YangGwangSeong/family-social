import { modalAtom } from '@/atoms/modalAtom';
import CustomButton from '@/components/ui/button/custom-button/CustomButton';
import { GroupService } from '@/services/group/group.service';
import { toggleVariant } from '@/utils/animation/toggle-variant';
import axios from 'axios';
import { motion } from 'framer-motion';
import router from 'next/router';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import React, { FC } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import LayerModalVariantWrapper from './LayerModalVariantWrapper';
import { useSuccessLayerModal } from '@/hooks/useSuccessLayerModal';
import { LayerMode } from 'types';

const GroupDeleteConfirm: FC = () => {
	const { groupId } = router.query as { groupId: string };
	const [, setIsShowing] = useRecoilState<boolean>(modalAtom);

	const { handleSuccessLayerModal } = useSuccessLayerModal();

	const { mutate: deleteGroupSync } = useMutation(
		['delete-group'],
		() => GroupService.deleteGroup(groupId),
		{
			onMutate: variable => {
				Loading.hourglass();
			},
			onSuccess(data) {
				Loading.remove();

				handleSuccessLayerModal({
					modalTitle: '그룹 삭제 성공',
					layer: LayerMode.successLayerModal,
					lottieFile: 'deleteAnimation',
					message: '그룹을 삭제 성공 하였습니다',
				});
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
		deleteGroupSync();
	};
	return (
		<LayerModalVariantWrapper>
			<div className="my-10 text-sm text-customGray">
				정말 그룹을 삭제하시겠습니까?
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

export default GroupDeleteConfirm;
