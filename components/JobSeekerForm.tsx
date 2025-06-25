import React, { useState } from 'react';
import { JobSeekerProfile } from '../types';
import { TagInput } from './TagInput'; // スキル入力用のタグコンポーネント

// このコンポーネントが受け取るプロパティの型定義
interface JobSeekerFormProps {
  // フォームが送信されたときに呼び出される関数
  // 入力されたプロフィール情報を引数として受け取る
  onSubmit: (profile: JobSeekerProfile) => void;
}

export const JobSeekerForm: React.FC<JobSeekerFormProps> = ({ onSubmit }) => {
  // 各入力フィールドの状態を管理
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [desiredSalary, setDesiredSalary] = useState('');
  const [desiredLocation, setDesiredLocation] = useState('');
  const [desiredIndustry, setDesiredIndustry] = useState('');

  // フォームが送信されたときの処理
  const handleSubmit = (e: React.FormEvent) => {
    // ページの再読み込みを防ぐ
    e.preventDefault();

    // 年収を数値に変換（空の場合は null に）
    const salaryAsNumber = desiredSalary ? parseInt(desiredSalary, 10) : null;

    // App.tsxに、入力されたすべてのデータを渡す
    onSubmit({
      workExperience,
      skills,
      desiredSalary: salaryAsNumber,
      desiredLocation,
      desiredIndustry,
    });
  };

  // 画面に表示されるフォームの構造 (JSX)
  return (
    <div className="form-container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#c00' }}>あなたの情報を入力してください</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 職務経歴 */}
        <div>
          <label htmlFor="work-experience">職務経歴 *</label>
          <textarea
            id="work-experience"
            value={workExperience}
            onChange={(e) => setWorkExperience(e.target.value)}
            placeholder="これまでの業務内容、実績などを具体的に入力してください..."
            required
            style={{ width: '100%', minHeight: '150px', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 保有スキル */}
        <div>
          <label>保有スキル *</label>
          {/* TagInputコンポーネントに、現在のスキル一覧と、変更があったときに呼び出す関数を渡す */}
          <TagInput tags={skills} setTags={setSkills} />
          <small>例: React, Python, プロジェクトマネジメント</small>
        </div>

        {/* 希望年収 */}
        <div>
          <label htmlFor="desired-salary">希望年収 (万円)</label>
          <input
            id="desired-salary"
            type="number"
            value={desiredSalary}
            onChange={(e) => setDesiredSalary(e.target.value)}
            placeholder="例: 600"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        
        {/* 希望勤務地 */}
        <div>
          <label htmlFor="desired-location">希望勤務地</label>
          <input
            id="desired-location"
            type="text"
            value={desiredLocation}
            onChange={(e) => setDesiredLocation(e.target.value)}
            placeholder="例: 東京都, 大阪府, リモート"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 希望業種 */}
        <div>
          <label htmlFor="desired-industry">希望業種</label>
          <input
            id="desired-industry"
            type="text"
            value={desiredIndustry}
            onChange={(e) => setDesiredIndustry(e.target.value)}
            placeholder="例: IT, 製造業, 金融"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 送信ボタン */}
        <button type="submit" style={{ padding: '12px', backgroundColor: '#c00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          マッチング開始
        </button>
      </form>
    </div>
  );
};