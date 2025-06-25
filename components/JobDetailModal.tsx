
import React from 'react';
import { JobOpening } from '../types';

interface JobDetailModalProps {
  job: JobOpening;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const formatSalary = (min: number | null, max: number | null): string => {
    if (min && max) return `${(min / 10000).toLocaleString()}万円～${(max / 10000).toLocaleString()}万円`;
    if (min) return `${(min / 10000).toLocaleString()}万円～`;
    if (max) return `～${(max / 10000).toLocaleString()}万円`;
    return '応相談';
  };

  const renderDetail = (label: string, value: string | undefined | null) => (
    value ? <div className="mb-3"><strong className="font-semibold text-gray-700">{label}:</strong><p className="text-gray-600 whitespace-pre-wrap">{value}</p></div> : null
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-red-700">{job.position}</h2>
            <p className="text-md text-gray-700">{job.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors text-3xl font-light"
            aria-label="閉じる"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4 text-sm">
          {renderDetail('企業名', job.raw['企業名'])}
          {renderDetail('ポジション', job.raw['ポジション'])}
          {renderDetail('年収', formatSalary(job.minSalary, job.maxSalary))}
          {renderDetail('勤務地', job.raw['勤務地'])}
          {renderDetail('勤務地詳細', job.raw['勤務地(詳細)'])}
          {renderDetail('業務内容', job.raw['業務内容'])}
          {renderDetail('応募資格', job.raw['応募資格'])}
          {renderDetail('求める人材', job.raw['求める人材'])}
          {renderDetail('雇用形態', job.raw['雇用形態'])}
          {renderDetail('募集背景', job.raw['募集背景'])}
          {renderDetail('★キーワード', job.raw['★キーワード'])}
          {renderDetail('待遇・福利厚生', job.raw['待遇・福利厚生'])}
          {renderDetail('休日休暇', job.raw['休日休暇'])}
          {renderDetail('勤務時間', job.raw['勤務時間'])}
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
