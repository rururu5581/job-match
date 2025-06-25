// ReactからuseStateをインポートする
import { useState } from 'react'; 
import { JobSeekerForm } from './components/JobSeekerForm'; // ← { } で囲む
import ResultsDisplay from './components/ResultsDisplay';  // ← これは default なのでそのままでOK
import { LoadingSpinner } from './components/LoadingSpinner'; // ← { } で囲む
import { JobSeekerProfile, JobOpening } from './types';
import { useJobData } from './hooks/useJobData';
import { analyzeWorkExperienceMatch } from './services/geminiService'; // APIを叩くサービス

function App() {
  // 'form', 'loading', 'results' の3つの状態を管理
  const [view, setView] = useState<'form' | 'loading' | 'results'>('form');
  // CSVから読み込んだ全求人情報
  const { jobs, isLoading: isLoadingJobs, error: jobsError } = useJobData();
  // マッチング結果を保存する状態
  const [matchedJobs, setMatchedJobs] = useState<{ job: JobOpening, score: number }[]>([]);

  // フォームが送信されたときの処理
  const handleFormSubmit = async (seekerProfile: JobSeekerProfile) => {
    setView('loading'); // ローディング画面に切り替え

    const seekerExperience = `
      保有スキル: ${seekerProfile.skills.join(', ')}
      希望年収: ${seekerProfile.desiredSalary}万円
      希望勤務地: ${seekerProfile.desiredLocation}
      希望業種: ${seekerProfile.desiredIndustry}
    `;

    try {
      // Promise.allで、全求人に対するAPI呼び出しを並行して実行
      const scoringPromises = jobs.map(async (job) => {
        const jobDetails = `
          ポジション: ${job['ポジション']}
          業務内容: ${job['業務内容']}
          応募資格: ${job['応募資格(概要)']} ${job['応募資格(詳細)']}
        `;
        // ★注意：geminiService.tsは/api/analyzeを呼び出すように以前修正したはずです
        // analyzeWorkExperienceMatch は number を返す Promise になっているはず
        const score = await analyzeWorkExperienceMatch(seekerExperience, jobDetails);
        return { job, score };
      });

      const results = await Promise.all(scoringPromises);

      // スコアが高い順に並び替え
      results.sort((a, b) => b.score - a.score);

      setMatchedJobs(results);
      setView('results'); // 結果表示画面に切り替え

    } catch (error) {
      console.error("マッチング処理中にエラーが発生しました:", error);
      // ここでエラー用の画面表示に切り替えることもできる
      setView('form'); // とりあえずフォームに戻す
    }
  };

  // メインの表示切り替えロジック
  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingSpinner />;
      case 'results':
        // ResultsDisplayコンポーネントに、マッチング結果を渡す
        return <ResultsDisplay matchedJobs={matchedJobs} />;
      case 'form':
      default:
        // JobSeekerFormに、送信時の処理を渡す
        return <JobSeekerForm onSubmit={handleFormSubmit} />;
    }
  };

  if (isLoadingJobs) return <div>求人マスターデータを準備中...</div>;
  if (jobsError) return <div>エラー: {jobsError}</div>;

  return (
    <div className="App">
       <header>
         {/* ...ヘッダーコンポーネントなど... */}
       </header>
       <main>
         {renderContent()}
       </main>
    </div>
  );
}

export default App;