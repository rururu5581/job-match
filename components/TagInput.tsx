import React, { useState } from 'react';

// TagInputコンポーネントが受け取るプロパティの型
interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  // Enterキーが押されたときの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enterキー以外、または入力が空の場合は何もしない
    if (e.key !== 'Enter' || !inputValue.trim()) {
      return;
    }
    
    // デフォルトのフォーム送信などを防ぐ
    e.preventDefault(); 
    
    // 新しいタグを既存のタグ一覧に追加
    setTags([...tags, inputValue.trim()]);
    
    // 入力フィールドを空にする
    setInputValue('');
  };

  // タグの削除ボタンが押されたときの処理
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {/* タグ一覧を表示するエリア */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px', border: '1px solid #ccc', padding: '8px' }}>
        {tags.map((tag, index) => (
          <div key={index} style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
            {tag}
            <button 
              type="button" // フォームを送信しないように type="button" を指定
              onClick={() => removeTag(tag)}
              style={{ marginLeft: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
            >
              x
            </button>
          </div>
        ))}

        {/* 新しいタグを入力するフィールド */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="スキルを入力してEnter"
          style={{ border: 'none', outline: 'none', flexGrow: 1 }}
        />
      </div>
    </div>
  );
};