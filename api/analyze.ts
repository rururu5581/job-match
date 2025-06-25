import type { VercelRequest, VercelResponse } from '@vercel/node';
// ★★★【最終修正】★★★
// ビルドログのエラーに基づき、正しいクラス名 "GoogleGenAI" に戻します。
// 私の案内の間違いでした。大変申し訳ありません。
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not configured on server.");
    return res.status(500).json({ error: "API service is not configured correctly." });
  }

  try {
    // ★★★【最終修正】★★★
    // 正しいクラス名 "GoogleGenAI" を使い、
    // コンストラクタには { apiKey } というオブジェクトを渡します。
    const genAI = new GoogleGenAI({ apiKey }); 
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    const scoreMatch = textResponse.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 0;
    
    if (isNaN(score) || score < 0 || score > 100) {
      console.error("Gemini returned an invalid score format:", textResponse);
      return res.status(500).json({ error: 'Received an invalid score format from the AI.' });
    }
    
    // 成功！
    return res.status(200).json({ score });

  } catch (error) {
    console.error("Error calling Gemini API for work experience analysis:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Gemini API Error: ${errorMessage}` });
  }
}