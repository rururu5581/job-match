
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} morich Co., Ltd. All rights reserved.</p>
        <p className="text-xs mt-1">Powered by Gemini API</p>
      </div>
    </footer>
  );
};
