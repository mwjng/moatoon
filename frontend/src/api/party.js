import axios from "axios";

// const BASE_URL = "http://localhost:8080"; ${BASE_URL}

export const fetchKeywords = async () => {
  try {
    const res = await axios.get(`/parties/keyword`);
    return res.data;
  } catch (err) {
    console.error("키워드 데이터 가져오기 실패:", err);
    throw err;
  }
};


export const sendStoryToBackend = async (storyData, imageUrl) => {
  try {

    const formData = new FormData();
    formData.append("imageUrl", imageUrl);
    formData.append("jsonData", JSON.stringify(storyData));
    

    const response = await axios.post(`/parties`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("스토리 전송 실패:", error);
    throw error;
  }
};

export const fetchRandomWords = async (level, episodeCount) => {
  try {
    const res = await axios.get(`/words/random`, {
      params: { level, episodeCount },
    });
    return res.data;
  } catch (err) {
    console.error("랜덤 단어 가져오기 실패:", err);
    throw err;
  }
};



export const fetchBookDetail = async (partyId) => {
  try {
    const res = await axios.get(`/parties/${partyId}`);
    return res.data;
  } catch (err) {
    console.error("파티 상세 정보 가져오기 실패:", err);
    throw err;
  }
};


export const fetchParties = async (filters) => {
  try {
    const res = await axios.get(`/parties`, { params: filters });
    return res.data; // 검색된 파티 리스트 반환
  } catch (err) {
    console.error("파티 검색 실패:", err);
    throw err;
  }
};


