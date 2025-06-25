
import React, { useState } from 'react';
import { JobSeekerProfile } from '../types';
import { TagInput } from './TagInput';

interface JobSeekerFormProps {
  onSubmit: (profile: JobSeekerProfile) => void;
}

export const JobSeekerForm: React.FC<JobSeekerFormProps> = ({ onSubmit }) => {
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [desiredSalary, setDesiredSalary] = useState<string>('');
  const [desiredLocation, setDesiredLocation] = useState('');
  const [desiredIndustry, setDesiredIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseInt(desiredSalary, 10);
    onSubmit({
      workExperience,
      skills,
      desiredSalary: isNaN(salary) ? null : salary,
      desiredLocation,
      desiredIndustry,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-8">あなたの情報を入力してください</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700 mb-1">
            職務経歴 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="workExperience"
            value={workExperience}
            onChange={(e) => setWorkExperience(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
            placeholder="これまでの業務内容、実績などを具体的に入力してください..."
            required
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            保有スキル <span className="text-red-500">*</span>
          </label>
          <TagInput value={skills} onChange={setSkills} placeholder="スキルを入力してEnter"/>
           <p className="text-xs text-gray-500 mt-1">例: React, Python, プロジェクトマネジメント</p>
        </div>

        <div>
          <label htmlFor="desiredSalary" className="block text-sm font-medium text-gray-700 mb-1">
            希望年収 (万円)
          </label>
          <input
            type="number"
            id="desiredSalary"
            value={desiredSalary}
            onChange={(e) => setDesiredSalary(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
            placeholder="例: 600"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="desiredLocation" className="block text-sm font-medium text-gray-700 mb-1">
            希望勤務地
          </label>
          <input
            type="text"
            id="desiredLocation"
            value={desiredLocation}
            onChange={(e) => setDesiredLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
            placeholder="例: 東京都, 大阪府, リモート"
          />
        </div>

        <div>
          <label htmlFor="desiredIndustry" className="block text-sm font-medium text-gray-700 mb-1">
            希望業種
          </label>
          <input
            type="text"
            id="desiredIndustry"
            value={desiredIndustry}
            onChange={(e) => setDesiredIndustry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
            placeholder="例: IT, 製造業, 金融"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out text-lg"
        >
          マッチング開始
        </button>
      </form>
    </div>
  );
};
