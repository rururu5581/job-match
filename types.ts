// 候補者の入力情報を扱うための型
export interface JobSeekerProfile {
  skills: string[];
  desiredSalary: number | null;
  desiredLocation: string;
  desiredIndustry: string;
}

// CSVから読み込む求人情報1件分のデータの型
export interface JobOpening {
  // --- 企業情報 ---
  "企業 ID": string;
  "企業名": string;
  "本社所在地": string;
  "電話(企業)": string;
  "代表者役職": string;
  "代表者名": string;
  "株式公開": string;
  "企業の所有者": string;
  "フェーズ": string;
  "フェーズ日付": string;
  "フェーズメモ": string;
  "URL": string;
  "取引先": string;
  "業種": string;
  "資本金": string;
  "事業内容・会社の特長": string;
  "待遇・福利厚生": string;
  "会社設立日": string;
  "従業員数": string;
  "休日休暇": string;
  "勤務時間": string;
  "求める人材像": string;
  "年間採用人数": string;
  "選考難易度": string;
  "メモ": string;
  "データ登録日": string;
  "データ更新日": string;
  
  // --- 求人情報 (JOB) ---
  "JOB ID": string;
  "採用予定人数": string;
  "優先度": string;
  "ポジション": string;
  "業務内容": string;
  "募集背景": string;
  "募集背景(詳細)": string;
  "給与(詳細)": string;
  "年齢制限の理由": string;
  "職種": string;
  "募集年齢(詳細)": string;
  "勤務地": string;
  "勤務地(詳細)": string;
  "応募資格(概要)": string;
  "応募資格(詳細)": string;
  "雇用形態": string;
  "雇用形態(詳細)": string;
  "選考プロセス": string;
  "受付年月日": string;
  "★キーワード★": string;
  "年収下限 [万円]": string;
  "年収上限 [万円] (選択肢型)": string;
}