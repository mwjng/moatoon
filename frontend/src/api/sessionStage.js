import { authInstance } from './axios';

export const getCurrentSessionStage = async (scheduleId) => {
  try {
      const response = await authInstance.get(`/schedules/${scheduleId}/session/current-stage`);
      return response;
  } catch (error) {
      console.error('세션 스테이지 조회 중 오류 발생:', error.response);
      return error.response;
  }
};