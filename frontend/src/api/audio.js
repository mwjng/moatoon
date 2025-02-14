import { authInstance } from './axios';

// api/audioApi.js
export const fetchAudio = async (audioType) => {
  const response = await authInstance.get(`/audio/page/${audioType}`, {
      responseType: 'blob'  // 중요! blob으로 받아야 함
  });
  
  if (response.status !== 200) {
      throw new Error('오디오를 불러올 수 없습니다.');
  }
  
  return response.data;  // blob 데이터 반환
};