import React from 'react';
import { useStickers } from '../../context/StickerContext';

const Statistics: React.FC = () => {
  const { stats } = useStickers();

  return (
    <div className="grid grid-cols-3 gap-3 p-5 max-w-md mx-auto">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span className="text-display-num text-3xl font-bold text-slate-900">{stats.faltam}</span>
        <span className="text-label-bold text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Faltam</span>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span className="text-display-num text-3xl font-bold text-primary">{stats.completas}</span>
        <span className="text-label-bold text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Coladas</span>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center border-b-2 border-b-secondary">
        <span className="text-display-num text-3xl font-bold text-secondary">{stats.repetidas}</span>
        <span className="text-label-bold text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Repetidas</span>
      </div>
    </div>
  );
};

export default Statistics;
