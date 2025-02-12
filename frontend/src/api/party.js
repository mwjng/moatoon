import { authInstance } from "./axios";

// const BASE_URL = "http://localhost:8080"; ${BASE_URL}

export const fetchKeywords = async () => {
  try {
    const res = await authInstance.get(`/parties/keyword`);
    return res.data;
  } catch (err) {
    console.error("키워드 데이터 가져오기 실패:", err);
    throw err;
  }
};

export const fetchRandomWords = async (level, episodeCount) => {
  try {
    const res = await authInstance.get(`/words/random`, {
      params: { level, episodeCount },
    });
    return res.data;
  } catch (err) {
    console.error("랜덤 단어 가져오기 실패:", err);
    throw err;
  }
};

export const sendStoryToBackend = async (storyData, imageUrl) => {
  try {
    // ✅ `FormData` 객체 생성
    const formData = new FormData();
    formData.append("imageUrl", imageUrl); // 이미지 URL 전달
    formData.append("jsonData", JSON.stringify(storyData)); // JSON 데이터 전달

    // ✅ 백엔드로 POST 요청
    const response = await authInstance.post(`/parties`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 파일 업로드 처리
      },
    });

    return response.data; //추가 후 partyId 받아옴.
  } catch (error) {
    console.error("스토리 전송 실패:", error);
    throw error;
  }
};

export const getPartyDetail = async (partyId) => {
  try {
    const response = await authInstance.get(`/parties/${partyId}`);
    return response.data;
  } catch (error) {
    console.error("파티 상세 정보 가져오기 실패:", error);
    throw error;
  }
};


export const addPartyMembers = async (partyId, childIds) => {
  try {
    const response = await authInstance.post(`/parties/${partyId}/members`, { childIds });
    return response.data;
  } catch (error) {
    console.error("파티 참여자 추가 실패:", error);
    throw error;
  }
};

export const removePartyMember = async (partyId, childId) => {
  try {
    const response = await authInstance.delete(`/parties/${partyId}/members?childId=${childId}`);
    return response.data;
  } catch (error) {
    console.error("파티 참여자 삭제 실패:", error);
    throw error;
  }
};



