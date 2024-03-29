import {
	CreateScheduleRequest,
	CreateScheduleResponse,
	GetScheduleListResponse,
	ScheduleItemResponse,
} from '@/shared/interfaces/schedule.interface';
import { axiosAPI } from 'api/axios';

export const ScheduleService = {
	async createSchedules({
		groupId,
		scheduleName,
		startPeriod,
		endPeriod,
		periods,
	}: CreateScheduleRequest) {
		const { data } = await axiosAPI.post<CreateScheduleResponse>(
			`/groups/${groupId}/schedules`,
			{
				scheduleName,
				startPeriod,
				endPeriod,
				periods,
			},
		);

		return data;
	},

	async getScheduleList(page: number, groupId: string) {
		const { data } = await axiosAPI.get<GetScheduleListResponse>(
			`/groups/${groupId}/schedules?page=${page}&limit=3`,
		);

		return data;
	},

	async getScheduleById(groupId: string, scheduleId: string) {
		const { data } = await axiosAPI.get<ScheduleItemResponse>(
			`/groups/${groupId}/schedules/${scheduleId}`,
		);

		return data;
	},

	async deleteSchedule(scheduleId: string, groupId: string) {
		const { data } = await axiosAPI.delete<void>(
			`/groups/${groupId}/schedules/${scheduleId}`,
		);

		return data;
	},

	async updateScheduleName(scheduleId: string, scheduleName: string) {
		const { data } = await axiosAPI.patch<void>(
			`/schedules/${scheduleId}/title`,
			{
				scheduleName,
			},
		);

		return data;
	},

	async uploadScheduleThumbnailImage(
		img: File,
		scheduleId: string,
	): Promise<string[]> {
		const formData = new FormData();
		formData.append('files', img);

		const { data } = await axiosAPI.patch(
			`/schedules/${scheduleId}/uploads/thumbnail-image`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
			},
		);

		return data;
	},
};
