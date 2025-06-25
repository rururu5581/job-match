import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { JobOpening } from '../types'; // 型のインポートをJobOpeningに合わせる

export const useJobData = () => {
  // 扱うデータの型を <JobOpening[]> に指定
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // あなたのCSVファイル名を指定
        const response = await fetch('/export_job.csv'); 
        if (!response.ok) {
          throw new Error('CSVファイルの読み込みに失敗しました。');
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true, // 1行目をキーとしてオブジェクトを作成
          skipEmptyLines: true,
          complete: (results) => {
            // results.dataをJobOpeningの配列として扱う
            // Papa.parseは空行をnullとして読み込むことがあるので、それを取り除く
            const validJobs = results.data.filter(job => job && (job as any)['JOB ID']) as JobOpening[];
            setJobs(validJobs);
            setIsLoading(false);
          },
          error: (err) => {
            // パース中にエラーが起きた場合
            console.error("CSV Parse Error:", err);
            throw new Error('CSVの解析に失敗しました。');
          }
        });

      } catch (err) {
        // fetchやその他のエラー
        console.error("Fetch/Processing Error:", err);
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // このフックは最初に一度だけ実行

  return { jobs, isLoading, error };
};