import { useState } from 'react';
import { JobSeekerForm } from './components/JobSeekerForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { JobSeekerProfile, JobOpening } from './types';
import { useJobData } from './hooks/useJobData';
import { analyzeWorkExperienceMatch } from './services/geminiService';

function App() {
  // 画面の状態を管理: 'form' | 'loading' | 'results'
  const [view, setView] = useState<'form' | 'loading' | 'results'>('form');
  
  // CSVから全求人データを読み込む
  const { jobs, isLoading: isLoadingJobs, error: jobsError } = useJobData();
  
  // マッチング結果を保存する
  const [matchedJobs, setMatchedJobs] = useState<{ job: JobOpening, score: number }[]>([]);

  // フォームが送信されたときに実行されるメインの処理
  const handleFormSubmit = async (seekerProfile: JobSeekerProfile) => {
    setView('loading'); // 1. ローディング画面に切り替える

    // ユーザーの入力情報を一つのテキストにまとめる
    const seekerExperience = `
      職務経歴: ${seekerProfile.workExperience}
      保有スキル: ${seekerProfile.skills.join(', ')}
      希望年収: ${seekerProfile.desiredSalary}万円
      希望勤務地: ${seekerProfile.desiredLocation}
      希望業種: ${seekerProfile.desiredIndustry}
    `;

    try {
      // 2. CSVから読み込んだ全求人に対して、一つずつAPIを呼び出す
      const scoringPromises = jobs.map(async (job) => {
        // 各求人の情報を一つのテキストにまとめる
        const jobDetails = `
          ポジション: ${job['ポジション']}
          業務内容: ${job['業務内容']}
          応募資格: ${job['応募資格(概要)']} ${job['応募資格(詳細)']}
          求める人材像: ${job['求める人材像']}
        `;
        
        // geminiService経由で、サーバーレス関数(/api/analyze)を呼び出す
        const score = await analyzeWorkExperienceMatch(seekerExperience, jobDetails);
        return { job, score };
      });

      // 3. 全てのAPI呼び出しが終わるのを待つ
      const results = await Promise.all(scoringPromises);

      // 4. 結果をスコアの高い順に並び替える
      results.sort((a, b) => b.score - a.score);

      setMatchedJobs(results);
      setView('results'); // 5. 結果表示画面に切り替える

    } catch (error) {
      console.error("マッチング処理中にエラーが発生しました:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
      setView('form'); // エラーが起きたらフォーム画面に戻す
    }
  };

  // 表示するコンポーネントを切り替えるための関数
  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingSpinner />;
      case 'results':
        return <ResultsDisplay matchedJobs={matchedJobs} />;
      case 'form':
      default:
        // JobSeekerFormに、onSubmitという名前で上記の処理を渡す
        return <JobSeekerForm onSubmit={handleFormSubmit} />;
    }
  };

  // --- JSX (実際の画面描画) ---

  // CSVデータの読み込み中は、何も表示しないか、ローディング表示を出す
  if (isLoadingJobs) {
    return <div>求人マスターデータを準備中...</div>;
  }
  // CSVデータの読み込みでエラーが起きた場合
  if (jobsError) {
    return <div>求人マスターデータの読み込みに失敗しました: {jobsError}</div>;
  }

  // メインの表示部分
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>morich job match</h1>
        <p>あなたにぴったりの求人を見つけよう</p>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;