import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const Dashboard = ({ user }) => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, `users/${user.uid}/figurinhas`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStickers(list);
      setLoading(false);
    });
    return unsubscribe;
  }, [user.uid]);

  const stats = {
    total: stickers.length,
    duplicates: stickers.filter(s => s.repetida).length,
    stuck: stickers.filter(s => s.colada).length,
    legends: stickers.filter(s => s.tipo === 'legend').length,
    shiny: stickers.filter(s => s.tipo === 'brilhante').length,
  };

  if (loading) return (
    <div className="flex flex-col gap-8 mt-4 animate-pulse">
      <div className="h-20 bg-surface-container rounded-xl w-3/4"></div>
      <div className="h-12 bg-surface-container rounded-full"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-32 bg-surface-container rounded-xl"></div>
        <div className="h-32 bg-surface-container rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 mt-4 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold">Visão Geral</h1>
        <p className="text-body-md text-on-surface-variant">Bem-vindo de volta! Veja seu progresso atual.</p>
      </div>

      <div className="flex items-center gap-3 bg-surface-container px-4 py-3 rounded-full border border-outline-variant w-full justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">trending_up</span>
          <span className="text-label-lg text-on-surface">Progresso Total</span>
        </div>
        <div className="flex-1 max-w-[200px] h-2 bg-surface-variant rounded-full ml-4 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, (stats.stuck / 600) * 100)}%` }}
          ></div>
        </div>
        <span className="text-label-sm ml-2 font-bold">{Math.round((stats.stuck / 600) * 100)}%</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="collections" value={stats.total} label="Total de Figurinhas" color="text-primary" />
        <StatCard icon="content_copy" value={stats.duplicates} label="Repetidas" color="text-tertiary" />
        <StatCard 
          icon="book" 
          value={stats.stuck} 
          label="Coladas no Álbum" 
          full 
          className="bg-primary-container border-outline-variant text-on-primary-container" 
        />
        <div className="bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim border border-secondary-fixed-dim rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden group">
          <span className="material-symbols-outlined text-on-secondary-container mb-2 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span className="text-display text-on-secondary-container">{stats.legends}</span>
          <span className="text-label-lg text-on-secondary-container mt-1">Legends</span>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 shiny-overlay"></div>
          <span className="material-symbols-outlined text-primary mb-2 text-3xl">flare</span>
          <span className="text-display text-on-surface">{stats.shiny}</span>
          <span className="text-label-lg text-on-surface-variant mt-1">Brilhantes</span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color, full, className = "" }) => (
  <div className={`bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm ${full ? 'col-span-2' : ''} ${className}`}>
    <span className={`material-symbols-outlined mb-2 text-3xl ${color}`}>{icon}</span>
    <span className="text-display text-on-surface font-bold">{value}</span>
    <span className="text-label-lg text-on-surface-variant mt-1">{label}</span>
  </div>
);

export default Dashboard;
