import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // この診断が実行されたことを示す
  console.log("--- Ultimate Diagnostic Run ---");
  console.log("Investigating the '@google/genai' module on Vercel...");

  try {
    // ステップ1: ライブラリを読み込む
    const googleGenaiLibrary = require("@google/genai");

    // ステップ2: 読み込んだライブラリの中身をすべてログに出力する
    console.log("--- Full content of require('@google/genai') ---");
    // JSON.stringifyで、オブジェクトの中身を文字列として表示
    console.log(JSON.stringify(googleGenaiLibrary, null, 2));

    // ステップ3: ライブラリが持っているプロパティの一覧を出力する
    console.log("--- Keys of the library object ---");
    console.log(Object.keys(googleGenaiLibrary));

    // ステップ4: 'GoogleGenerativeAI'プロパティの「型」を調べる
    if (googleGenaiLibrary.GoogleGenerativeAI) {
      console.log("--- Type of the 'GoogleGenerativeAI' property ---");
      console.log(typeof googleGenaiLibrary.GoogleGenerativeAI);
    } else {
      console.log("--- The 'GoogleGenerativeAI' property does NOT exist. ---");
    }
    
    // これ以上の処理は行わず、診断が完了したことを知らせる
    return res.status(500).json({ 
      message: "Diagnostic run is complete. Please check the Vercel logs.",
      libraryKeys: Object.keys(googleGenaiLibrary)
    });

  } catch (error) {
    console.error("--- !!! TOP-LEVEL CATCH BLOCK ERROR !!! ---");
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Runtime Error: ${errorMessage}` });
  }
}