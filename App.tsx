
// import JobCard from './components/JobCard'; // 求人カードコンポーネントのパスはあなたの構成に合わせてください
import { useJobData } from './hooks/useJobData'; // 作成したフックをインポート

function App() {
  // フックを使ってCSVからデータを取得
  const { jobs, isLoading, error } = useJobData();

  // データ読み込み中の表示
  if (isLoading) {
    return <div className="loading-message">求人データを読み込み中...</div>;
  }

  // エラーが発生した場合の表示
  if (error) {
    return <div className="error-message">エラーが発生しました: {error}</div>;
  }

  // データを表示
  return (
    <div className="App">
      <header className="App-header">
        <h1>求人一覧</h1>
      </header>
      <main className="job-list">
        {jobs.map((job) => (
          // --- ここで求人カードコンポーネントを呼び出す ---
          // <JobCard key={job['JOB ID']} job={job} />

          // ↓↓↓ まずは、正しくデータが読み込めているか確認するために、簡単な表示を試しましょう ↓↓↓
          <div key={job['JOB ID']} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>{job['ポジション']}</h2>
            <p><strong>企業名:</strong> {job['企業名']}</p>
            <p><strong>勤務地:</strong> {job['勤務地']}</p>
            <p><strong>年収:</strong> {job['年収下限 [万円]']}万円 〜 {job['年収上限 [万円] (選択肢型)']}万円</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;