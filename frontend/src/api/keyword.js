import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 분위기, 테마, 장르 키워드 가져오기
export const fetchKeywords = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/parties/keyword`);
    return res.data;
  } catch (err) {
    console.error("키워드 데이터 가져오기 실패:", err);
    throw err;
  }
};

// 난이도 및 에피소드 수에 맞는 랜덤 단어 가져오기
export const fetchRandomWords = async (level, episodeCount) => {
  try {
    const res = await axios.get(`${BASE_URL}/words/random`, {
      params: { level, episodeCount },
    });
    return res.data;
  } catch (err) {
    console.error("랜덤 단어 가져오기 실패:", err);
    throw err;
  }
};
