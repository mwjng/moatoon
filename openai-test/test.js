import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // ✅ 환경변수 로드

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ .env 파일에서 API 키 로드
});

const testAPI = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "write a haiku about AI" }],
    });

    console.log("✅ 응답 결과:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
  }
};

testAPI();
