
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-red-700 shadow-md">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          morich job match
        </h1>
        <p className="text-red-100 text-sm">あなたにぴったりの求人を見つけよう</p>
      </div>
    </header>
  );
};
