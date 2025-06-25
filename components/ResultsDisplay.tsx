
import React, { useState } from 'react';
import { MatchResult, JobOpening } from '../types';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';

interface ResultsDisplayProps {
  results: MatchResult[];
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  const handleCardClick = (job: JobOpening) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-red-700">マッチング結果</h2>
        <button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          再検索する
        </button>
      </div>
      
      {results.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">条件に合う求人は見つかりませんでした。</p>
      ) : (
        <div className="space-y-6">
          {results.map(result => (
            <JobCard key={result.job.id} result={result} onClick={() => handleCardClick(result.job)} />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={closeModal} />
      )}
    </div>
  );
};
