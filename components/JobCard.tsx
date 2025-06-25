
import React from 'react';
import { MatchResult } from '../types';

interface JobCardProps {
  result: MatchResult;
  onClick: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 20; // 20 is radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-red-600';
  if (percentage < 40) colorClass = 'text-yellow-500';
  if (percentage >= 40 && percentage < 70) colorClass = 'text-blue-500';
  if (percentage >= 70) colorClass = 'text-green-500';
  
  // Tailwind does not support dynamic stroke colors directly in class names like stroke-${color},
  // so we'd typically use inline styles or more complex setup. For simplicity, we use text color for the number.
  // The circle itself will be a static color or require more advanced SVG handling for dynamic stroke based on score.
  // Here, we'll use a fixed red for the circle progress.

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full" viewBox="0 0 44 44">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="22"
          cy="22"
        />
        <circle
          className="text-red-500" // Progress color
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="22"
          cy="22"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${colorClass}`}>
        {Math.round(percentage)}
      </div>
    </div>
  );
};


export const JobCard: React.FC<JobCardProps> = ({ result, onClick }) => {
  const { job, score } = result;

  const formatSalary = (min: number | null, max: number | null): string => {
    if (min && max) return `${(min / 10000).toLocaleString()}万円～${(max / 10000).toLocaleString()}万円`;
    if (min) return `${(min / 10000).toLocaleString()}万円～`;
    if (max) return `～${(max / 10000).toLocaleString()}万円`;
    return '応相談';
  };

  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer border border-transparent hover:border-red-300"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-grow mb-4 md:mb-0 md:mr-6">
          <h3 className="text-xl font-bold text-red-700">{job.position}</h3>
          <p className="text-gray-800 text-md">{job.companyName}</p>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">勤務地:</span> {job.location || 'N/A'}</p>
            <p><span className="font-semibold">年収:</span> {formatSalary(job.minSalary, job.maxSalary)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <ScoreCircle score={score.total} />
          <p className="text-xs text-gray-500 mt-1">総合マッチ度</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <span className="font-semibold">スキル:</span> {score.skill.toFixed(0)}点, {' '}
          <span className="font-semibold">年収:</span> {score.salary.toFixed(0)}点, {' '}
          <span className="font-semibold">職務経歴:</span> {score.experience.toFixed(0)}点, {' '}
          <span className="font-semibold">勤務地:</span> {score.location.toFixed(0)}点
        </p>
      </div>
    </div>
  );
};
