// src/services/geminiService.ts

/**
 * 職務経歴と求人情報のマッチ度を分析するAPIを呼び出します。
 * この関数はフロントエンドから安全に呼び出すことができ、
 * 実際のAPIキーを使った処理はサーバーサイドの /api/analyze で行われます。
 *
 * @param seekerExperience 候補者の職務経歴
 * @param jobDetails 求人情報
 * @returns マッチ度のスコア (0-100)
 */
export const analyzeWorkExperienceMatch = async (
  seekerExperience: string,
  jobDetails: string
): Promise<number> => {

  try {
    // Vercel上で動く自分のサーバーレス関数を呼び出します
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // リクエストボディにデータを詰めて送ります
      body: JSON.stringify({ seekerExperience, jobDetails }),
    });

    // サーバーがエラーを返した場合 (例: ステータスコード 400, 500 など)
    if (!response.ok) {
      // エラーレスポンスの本文を読み取ります
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      // 読み取ったエラーメッセージで新しいErrorオブジェクトを作成し、スローします
      throw new Error(errorData.error || 'An unknown API error occurred');
    }

    // 成功した場合、レスポンスの本文をJSONとして読み取ります
    const data = await response.json();

    // { score: 85 } のようなオブジェクトが返ってくるので、scoreプロパティを返します
    return data.score;

  } catch (error) {
    // ネットワークエラーや上記でスローされたエラーをキャッチします
    console.error("Failed to analyze work experience:", error);

    // エラーを呼び出し元のコンポーネントに再度スローして、
    // ローディングを止めたり、エラーメッセージを表示したりできるようにします
    throw error;
  }
};