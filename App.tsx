
import React, { useState, useCallback } from 'react';
import { JobSeekerProfile, JobOpening, MatchResult } from './types';
import { JobSeekerForm } from './components/JobSeekerForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { calculateMatchScores } from './services/matchingService';
import { useMockJobData } from './hooks/useMockJobData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [jobSeekerProfile, setJobSeekerProfile] = useState<JobSeekerProfile | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { jobOpenings, loading: jobsLoading, error: jobsError } = useMockJobData();

  const handleProfileSubmit = useCallback(async (profile: JobSeekerProfile) => {
    setIsLoading(true);
    setError(null);
    setJobSeekerProfile(profile);
    setMatchResults([]); // Clear previous results

    if (jobsError) {
      setError(`求人情報の読み込みに失敗しました: ${jobsError}`);
      setIsLoading(false);
      return;
    }

    if (!jobOpenings || jobOpenings.length === 0) {
      setError("求人情報がありません。");
      setIsLoading(false);
      return;
    }

    try {
      const results = await calculateMatchScores(profile, jobOpenings);
      // Sort results by total score descending
      results.sort((a, b) => b.score.total - a.score.total);
      setMatchResults(results);
    } catch (e) {
      console.error("Matching error:", e);
      setError(e instanceof Error ? e.message : "マッチング処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [jobOpenings, jobsError]);

  const handleReset = () => {
    setJobSeekerProfile(null);
    setMatchResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {jobsLoading && !isLoading && <p className="text-center text-gray-600">求人データをロード中...</p>}
        
        {!jobSeekerProfile && !isLoading && !jobsLoading && (
          <JobSeekerForm onSubmit={handleProfileSubmit} />
        )}
        
        {jobSeekerProfile && !isLoading && matchResults.length > 0 && (
          <ResultsDisplay results={matchResults} onReset={handleReset} />
        )}

        {jobSeekerProfile && !isLoading && matchResults.length === 0 && !error && !jobsLoading && (
           <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">該当する求人は見つかりませんでした。</p>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              再検索する
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
