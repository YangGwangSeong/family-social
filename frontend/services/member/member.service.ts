import { UpdateProfileRequest } from '@/components/ui/modal/layer-modal/layer/EditProfile/edit-profile.interface';
import {
	MembersBelongToGroupResponse,
	MembersResponse,
} from '@/shared/interfaces/member.interface';
import { axiosAPI } from 'api/axios';

export const MemberService = {
	async updateProfile({
		memberId,
		username,
		phoneNumber,
		profileImage,
	}: UpdateProfileRequest) {
		const { data } = await axiosAPI.put<void>(`/members/${memberId}`, {
			username,
			phoneNumber,
			profileImage,
		});

		return data;
	},

	async getMembersBelongToGroup(groupId: string) {
		const { data } = await axiosAPI.get<MembersBelongToGroupResponse[]>(
			`groups/${groupId}/members/`,
		);
		return data;
	},

	async getMembersByUserName(username: string) {
		const { data } = await axiosAPI.get<MembersResponse[]>(
			`/members/${username}`,
		);
		return data;
	},
};
