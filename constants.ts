
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17";

export const SCORING_WEIGHTS = {
  SKILL: 40,
  SALARY: 30,
  EXPERIENCE: 20,
  LOCATION: 10,
};

// IMPORTANT: This API_KEY is a placeholder. In a real Vercel deployment,
// process.env.API_KEY would be set via Vercel's environment variable settings.
// For local development, you would set this in your .env.local file (not part of this bundle).
// For the purpose of this generated code, we assume `process.env.API_KEY` is available.
// if (!process.env.API_KEY) {
//   console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
// }

// Sample CSV Headers:
// 企業ID,企業名,本社所在地,電話(企業),代表者,役職,代表者名,株式公開,企業の所有,フェーズ,フェーズE,フェーズメURL,取引先,業種,資本金,事業内容,待遇・福利厚生,会社設立日,従業員数,休日休暇,勤務時間,求める人材,年間採用人数,選考難易度,メモ,データ登録日,データ更新日,JOB ID,採用予定人数,優先度,ポジション,業務内容,募集背景,給与(詳細),年齢制限の職種,募集年齢(勤務),勤務地,勤務地(詳細),応募資格,雇用形態,受付年月日,★キーワード,年収下限,年収上限
export const MOCK_CSV_DATA = `
企業ID,企業名,本社所在地,電話(企業),代表者,役職,代表者名,株式公開,企業の所有,フェーズ,フェーズE,フェーズメURL,取引先,業種,資本金,事業内容,待遇・福利厚生,会社設立日,従業員数,休日休暇,勤務時間,求める人材,年間採用人数,選考難易度,メモ,データ登録日,データ更新日,JOB ID,採用予定人数,優先度,ポジション,業務内容,募集背景,給与(詳細),年齢制限の職種,募集年齢(勤務),勤務地,勤務地(詳細),応募資格,雇用形態,受付年月日,★キーワード,年収下限,年収上限
CORP001,株式会社TechNext,東京都渋谷区,03-1234-5678,山田太郎,CEO,山田太郎,非公開,プライベート,成長期,C,https://technext.example.com,大手企業多数,IT・Webサービス,1億円,最先端技術を駆使したSaaSプロダクト開発,社会保険完備・リモートワーク可,2015-04-01,150人,完全週休2日制（土日祝）,10:00-19:00 (フレックスタイム制コアタイム11:00-16:00),自律的に行動できる方・新しい技術に挑戦したい方,10名,普通,特記事項なし,2024-01-15,2024-05-01,JOB_TN_001,3,高,シニアソフトウェアエンジニア,"React, TypeScript, Node.jsを用いたWebアプリケーションの設計、開発、運用。チームリーダーとしての役割も期待。",事業拡大に伴う増員,"年俸制、ストックオプション制度あり","","",東京都渋谷区,本社またはリモート,"コンピュータサイエンスの学位または同等の実務経験。ReactおよびNode.jsでの5年以上の開発経験。クラウドプラットフォーム（AWS, GCPなど）の知識。",正社員,2024-05-01,"React,TypeScript,Node.js,AWS,SaaS,アジャイル",7000000,12000000
CORP002,グリーンエネルギー株式会社,大阪府大阪市,06-9876-5432,佐藤花子,代表取締役,佐藤花子,上場,公開,安定期,E,https://greenenergy.example.com,地方自治体・電力会社,再生可能エネルギー,5億円,太陽光発電システムの開発・販売・保守,資格取得支援制度・寮社宅あり,2010-07-20,300人,年間休日125日,09:00-17:30,社会貢献に関心のある方・コミュニケーション能力の高い方,5名,やや高,業界未経験者歓迎,2024-02-01,2024-04-20,JOB_GE_002,2,中,プロジェクトマネージャー（再生可能エネルギー）,"再生可能エネルギー発電所の開発プロジェクト管理。計画立案、進捗管理、関係各所との調整業務。",新規プロジェクト立ち上げのため,"月給制、賞与年2回","","",大阪府大阪市,本社（出張あり）,"プロジェクトマネジメント経験3年以上。再生可能エネルギー業界経験者優遇。普通自動車免許。",正社員,2024-04-20,"プロジェクト管理,再生可能エネルギー,太陽光発電,コミュニケーション",6000000,9000000
CORP003,株式会社CreativeStyle,福岡県福岡市,092-111-2222,田中一郎,社長,田中一郎,非公開,個人経営,スタートアップ,A,https://creativestyle.example.com,中小企業,デザイン・広告,500万円,ウェブサイト制作、グラフィックデザイン、ブランディング支援,服装自由・副業OK,2020-01-10,15人,土日祝休み,09:30-18:30,クリエイティブな仕事が好きな方・成長意欲の高い方,2名,普通,ポートフォリオ必須,2024-03-10,2024-05-10,JOB_CS_003,1,中,Webデザイナー,クライアント企業のWebサイトデザインおよびコーディング。UI/UX設計にも関与。,案件増加によるメンバー募集,スキル・経験に応じて決定,"","",福岡県福岡市,本社,"Webデザイン実務経験2年以上。Photoshop, Illustrator, Figmaの使用経験。HTML, CSS, JavaScriptの基礎知識。",契約社員,2024-05-10,"Webデザイン,UI,UX,Figma,HTML,CSS",4000000,6500000
CORP004,株式会社Morich Consulting,東京都港区,03-5555-7777,森七菜,代表,森七菜,非公開,プライベート,急成長中,B,https://morich.example.com,多業種,人材紹介・コンサルティング,3000万円,経営戦略コンサルティング、人材紹介サービス,インセンティブ制度充実・研修制度あり,2018-06-01,50人,土日祝、夏季・年末年始休暇,09:00-18:00,成果志向の強い方・チャレンジ精神旺盛な方,若干名,高,英語力あれば尚可,2024-01-01,2024-05-15,JOB_MC_001,3,高,キャリアコンサルタント,求職者へのキャリアカウンセリングおよび求人紹介。企業への採用コンサルティング。,事業拡大のため,固定給＋高率インセンティブ,"","",東京都港区,本社,大卒以上。営業経験または人材業界経験2年以上。高いコミュニケーション能力。,正社員,2024-05-15,"人材紹介,キャリアコンサルティング,営業,コミュニケーション",5000000,15000000
`;

// Indices based on the provided CSV header string
export const CSV_HEADERS = "企業ID,企業名,本社所在地,電話(企業),代表者,役職,代表者名,株式公開,企業の所有,フェーズ,フェーズE,フェーズメURL,取引先,業種,資本金,事業内容,待遇・福利厚生,会社設立日,従業員数,休日休暇,勤務時間,求める人材,年間採用人数,選考難易度,メモ,データ登録日,データ更新日,JOB ID,採用予定人数,優先度,ポジション,業務内容,募集背景,給与(詳細),年齢制限の職種,募集年齢(勤務),勤務地,勤務地(詳細),応募資格,雇用形態,受付年月日,★キーワード,年収下限,年収上限".split(',');

export const CSV_COLUMN_MAP: { [key: string]: number } = {
  COMPANY_ID: CSV_HEADERS.indexOf('企業ID'),
  COMPANY_NAME: CSV_HEADERS.indexOf('企業名'),
  POSITION: CSV_HEADERS.indexOf('ポジション'),
  JOB_DESCRIPTION: CSV_HEADERS.indexOf('業務内容'),
  IDEAL_CANDIDATE: CSV_HEADERS.indexOf('求める人材'),
  LOCATION: CSV_HEADERS.indexOf('勤務地'),
  QUALIFICATIONS: CSV_HEADERS.indexOf('応募資格'),
  KEYWORDS: CSV_HEADERS.indexOf('★キーワード'),
  MIN_SALARY: CSV_HEADERS.indexOf('年収下限'),
  MAX_SALARY: CSV_HEADERS.indexOf('年収上限'),
  JOB_ID: CSV_HEADERS.indexOf('JOB ID'),
};
