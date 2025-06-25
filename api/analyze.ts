import type { VercelRequest, VercelResponse } from '@vercel/node';

// ★★★【最終奥義】★★★
// import文を使わず、関数の中で動的にライブラリを読み込む
// これにより、Vercelのビルド環境のモジュール解釈の混乱を回避する

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API key is not configured.");
    return res.status(500).json({ error: "API service is not configured." });
  }

  try {
    // 1. 関数の中で動的にライブラリを読み込む
    const genai = await import('@google/genai');
    
    // 2. 読み込んだオブジェクトの中から、GoogleGenerativeAIクラスを取り出す
    const GoogleGenerativeAI = genai.GoogleGenerativeAI;

    // 3. そのクラスを使ってインスタンスを作成する
    const genAIInstance = new GoogleGenerativeAI(apiKey);
    const model = genAIInstance.getGenerativeModel({ model: "gemini-pro" });

    // --- 以下、変更なし ---
    const { seekerExperience, jobDetails } = req.body;
    if (!seekerExperience || !jobDetails) {
      return res.status(400).json({ error: 'seekerExperience and jobDetails are required.' });
    }

    const prompt = `Rate the relevance of the following candidate's work experience to the job description on a scale of 0 to 100. Candidate experience: "${seekerExperience}" Job description (including role, responsibilities, and ideal candidate): "${jobDetails}" Respond with only the numerical score. For example, if the score is 75, respond with "75".`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    const scoreMatch = textResponse.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 0;
    
    if (isNaN(score)) { throw new Error("Parsed score is NaN"); }
    
    return res.status(200).json({ score });

  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Gemini API Error: ${errorMessage}` });
  }
}