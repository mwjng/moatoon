import { authInstance } from './axios';

export const fetchAudio = async (audioType) => {
    const response = await authInstance.get(`/audio/page/${audioType}`);
    if (!response.ok) {
      throw new Error('오디오를 불러올 수 없습니다.');
    }
    return response;
  };