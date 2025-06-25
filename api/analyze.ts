import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gemini APIのエンドポイントURL
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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
    const { seekerExperience, jobDetails } = req.body;
    if (!seekerExperience || !jobDetails) {
      return res.status(400).json({ error: 'seekerExperience and jobDetails are required.' });
    }

    // Gemini APIに送信するリクエストの本文を作成
    const requestBody = {
      contents: [{
        parts: [{
          text: `Rate the relevance of the following candidate's work experience to the job description on a scale of 0 to 100. Candidate experience: "${seekerExperience}" Job description (including role, responsibilities, and ideal candidate): "${jobDetails}" Respond with only the numerical score. For example, if the score is 75, respond with "75".`
        }]
      }]
    };

    // Node.jsの標準機能である fetch を使って、直接APIを呼び出す
    const apiResponse = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // APIからの応答がエラーだった場合
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Google API Error:", errorData);
      throw new Error(errorData.error?.message || 'Google API returned an error.');
    }

    // 成功した場合、応答をJSONとして解析
    const responseData = await apiResponse.json();
    
    // APIの応答の中から、AIが生成したテキスト部分を取り出す
    const textResponse = responseData.candidates[0].content.parts[0].text;

    const scoreMatch = textResponse.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 0;
    
    if (isNaN(score)) {
      throw new Error("Parsed score is NaN. AI Response: " + textResponse);
    }
    
    // 成功！
    return res.status(200).json({ score });

  } catch (error) {
    console.error("Handler Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `An unexpected error occurred: ${errorMessage}` });
  }
}