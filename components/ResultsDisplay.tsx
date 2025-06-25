import React from 'react';
import { JobOpening } from '../types';

interface ResultsDisplayProps {
  matchedJobs: { job: JobOpening, score: number }[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ matchedJobs }) => {
  return (
    <div>
      <h1>マッチング結果</h1>
      {matchedJobs.map(({ job, score }) => (
        <div key={job['JOB ID']} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h2>{job['ポジション']} (マッチ度: {score}点)</h2>
          <p><strong>企業名:</strong> {job['企業名']}</p>
          <p><strong>勤務地:</strong> {job['勤務地']}</p>
          <p><strong>年収:</strong> {job['年収下限 [万円]']}万円 〜 {job['年収上限 [万円] (選択肢型)']}万円</p>
        </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;