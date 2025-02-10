// api/scheduleApi.js
import { authInstance } from './axios';

const SCHEDULE_API_URL = '/schedules';

export const getMonthlySchedule = async (year, month) => {
    try {
        const response = await authInstance.get(`${SCHEDULE_API_URL}/manager`, {
            params: {
                year: year,
                month: month
            }
        });
        return response;
    } catch (error) {
        console.error('스케줄 조회 중 오류 발생:', error);
        return error.response;
    }
};