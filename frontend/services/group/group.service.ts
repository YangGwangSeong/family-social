import { FeedsResponse } from '@/shared/interfaces/feed.interface';
import {
	GroupResponse,
	MemberBelongToGroupsResponse,
} from '@/shared/interfaces/group.interface';
import { GetScheduleListResponse } from '@/shared/interfaces/schedule.interface';
import { axiosAPI } from 'api/axios';

export const GroupService = {
	async getMemberBelongToGroups(): Promise<MemberBelongToGroupsResponse[]> {
		const { data } = await axiosAPI.get<MemberBelongToGroupsResponse[]>(
			'/groups',
		);

		return data;
	},

	async getScheduleListByGroupId(groupId: string, page: number, limit: number) {
		const { data } = await axiosAPI.get<GetScheduleListResponse>(
			`/groups/${groupId}/schedules?page=${page}&limit=${limit}`,
		);

		return data;
	},

	async createGroup(
		groupName: string,
		groupDescription: string,
	): Promise<GroupResponse> {
		const { data } = await axiosAPI.post<GroupResponse>('/groups', {
			groupName,
			groupDescription,
		});

		return data;
	},

	async updateGroup(
		groupId: string,
		groupName: string,
		groupDescription: string,
	): Promise<GroupResponse> {
		const { data } = await axiosAPI.put<GroupResponse>(`/groups/${groupId}`, {
			groupName,
			groupDescription,
		});

		return data;
	},

	async deleteGroup(groupId: string) {
		const { data } = await axiosAPI.delete<void>(`/groups/${groupId}`);
	},
};
