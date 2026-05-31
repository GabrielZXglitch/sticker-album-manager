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
    }, (error) => {
      console.error("Dashboard listener error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const stats = {
    total: stickers.length,
    duplicates: stickers.filter(s => s.repetida).length,
    stuck: stickers.filter(s => s.colada).length,
    legends: stickers.filter(s => s.tipo === 'legend').length,
    shiny: stickers.filter(s => s.tipo === 'brilhante').length,
  };

  if (loading) return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-32 bg-primary/20 w-full"></div>
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="h-24 bg-surface-container rounded-xl"></div>
        <div className="h-24 bg-surface-container rounded-xl"></div>
        <div className="h-24 bg-surface-container rounded-xl"></div>
        <div className="h-24 bg-surface-container rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <div className="bg-primary px-6 py-10 text-on-primary">
        <h1 className="text-headline-md font-bold mb-1">Visão Geral</h1>
        <p className="text-body-md opacity-90">Bem-vindo de volta ao seu álbum!</p>
      </div>

      <div className="px-4 -mt-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon="collections" 
            value={stats.total} 
            label="Total" 
            iconColor="text-primary" 
          />
          <StatCard 
            icon="content_copy" 
            value={stats.duplicates} 
            label="Repetidas" 
            iconColor="text-tertiary" 
          />
          <StatCard 
            icon="stars" 
            value={stats.legends} 
            label="Legends" 
            iconColor="text-secondary"
            className="border-secondary/30 border-2"
          />
          <StatCard 
            icon="flare" 
            value={stats.shiny} 
            label="Brilhantes" 
            iconColor="text-primary"
            className="border-tertiary-container/50 border-2"
            isShiny
          />
          <StatCard 
            icon="book" 
            value={stats.stuck} 
            label="Coladas" 
            iconColor="text-primary"
            full
            className="bg-primary-container/10"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, iconColor, full, className = "", isShiny }) => (
  <div className={`
    bg-surface rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.05)]
    ${full ? 'col-span-2 py-6' : ''} 
    ${className}
    relative overflow-hidden
  `}>
    {isShiny && <div className="absolute inset-0 shiny-overlay opacity-30"></div>}
    <span className={`material-symbols-outlined mb-1 text-2xl ${iconColor}`}>{icon}</span>
    <span className="text-headline-md font-bold text-on-surface leading-none">{value}</span>
    <span className="text-label-lg font-bold text-on-surface-variant uppercase mt-1">{label}</span>
  </div>
);

export default Dashboard;
