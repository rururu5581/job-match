import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// AIモデルの初期化処理を、リクエスト毎に関数の内部で行うように変更します。
// これにより、TypeScriptの型推論が簡単になり、エラーが解消されます。

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. メソッドがPOSTであるか最初にチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. APIキーの存在チェック
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not configured on server.");
    return res.status(500).json({ error: "API service is not configured correctly." });
  }

  try {
    // 3. 必要な時にGemini AIのインスタンスを作成
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // モデル名を直接指定

    // 4. リクエストのbodyからデータを取得
    const { seekerExperience, jobDetails } = req.body;
    if (!seekerExperience || !jobDetails) {
      return res.status(400).json({ error: 'seekerExperience and jobDetails are required.' });
    }

    const prompt = `
      Rate the relevance of the following candidate's work experience to the job description on a scale of 0 to 100.
      Candidate experience: "${seekerExperience}"
      Job description (including role, responsibilities, and ideal candidate): "${jobDetails}"
      Respond with only the numerical score. For example, if the score is 75, respond with "75".
    `;

    // 5. APIを呼び出し
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    let scoreStr = textResponse.trim();
    const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s;
    const match = scoreStr.match(fenceRegex);
    if (match && match[2]) {
      scoreStr = match[2].trim();
    }

    const score = parseInt(scoreStr, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      console.error("Gemini returned an invalid score format:", textResponse);
      return res.status(500).json({ error: 'Received an invalid score format from the AI.' });
    }

    // 6. 成功レスポンスを返す
    return res.status(200).json({ score: score });

  } catch (error) {
    console.error("Error calling Gemini API for work experience analysis:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Gemini API Error: ${errorMessage}` });
  }
}