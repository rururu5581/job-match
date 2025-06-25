import type { VercelRequest, VercelResponse } from '@vercel/node';
// ライブラリ全体を "GoogleAI" という名前でインポートして調査します
import * as GoogleAI from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // この関数が呼び出されたことをログに出力
  console.log("--- Analyze API function invoked ---");

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("!!! CRITICAL: API_KEY environment variable is NOT set.");
    return res.status(500).json({ error: "API service is not configured correctly." });
  }
  console.log("API_KEY is present.");

  try {
    // --- ここから診断ログ ---
    console.log("1. Inspecting the '@google/genai' library import (GoogleAI):");
    // インポートしたライブラリの中身をすべて表示
    console.log(GoogleAI);

    // ライブラリの中にあるはずの "GoogleGenerativeAI" クラスを調査
    const GenerativeAIClass = (GoogleAI as any).GoogleGenerativeAI;
    console.log("2. Is GoogleGenerativeAI a function/class? Type:", typeof GenerativeAIClass);
    // --- 診断ログここまで ---

    // 実際の処理
    const genAI = new GenerativeAIClass(apiKey);
    console.log("3. 'genAI' object has been created.");

    // エラーが起きている箇所を調査
    console.log("4. Does genAI.getGenerativeModel exist? Type:", typeof genAI.getGenerativeModel);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("5. Model object created successfully.");

    const { seekerExperience, jobDetails } = req.body;
    // ...以降の処理は変更なし...
    const prompt = `Rate the relevance of the following candidate's work experience to the job description on a scale of 0 to 100. Candidate experience: "${seekerExperience}" Job description (including role, responsibilities, and ideal candidate): "${jobDetails}" Respond with only the numerical score. For example, if the score is 75, respond with "75".`;
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const scoreMatch = textResponse.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 0;
    
    if (isNaN(score)) { throw new Error("Parsed score is NaN"); }
    
    console.log("6. Successfully generated score:", score);
    return res.status(200).json({ score });

  } catch (error) {
    console.error("--- !!! CATCH BLOCK ERROR !!! ---");
    // エラーオブジェクトそのものをログに出力
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Gemini API Runtime Error: ${errorMessage}` });
  }
}