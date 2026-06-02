import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-5 py-6 sticky top-0 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Copa Sticker Tracker
        </h1>
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">
          🏆
        </div>
      </div>
    </header>
  );
};

export default Header;
