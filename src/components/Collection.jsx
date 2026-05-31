import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const Collection = ({ user }) => {
  const [stickers, setStickers] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSelecao, setFilterSelecao] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const { openForm } = useOutletContext();

  useEffect(() => {
    const qS = query(collection(db, 'selecoes'), orderBy('name'));
    const unsubscribeS = onSnapshot(qS, (snapshot) => {
      setSelecoes(snapshot.docs.map(doc => doc.data().name));
    }, (error) => console.error("Selecoes listener error:", error));

    const q = query(collection(db, `users/${user.uid}/figurinhas`), orderBy('jogador'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStickers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Collection listener error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeS();
      unsubscribe();
    };
  }, [user.uid]);

  const filteredStickers = stickers.filter(s => {
    const matchSearch = s.jogador.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterSelecao === 'Todas' || s.selecao === filterSelecao;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Deseja excluir esta figurinha?')) {
      await deleteDoc(doc(db, `users/${user.uid}/figurinhas`, id));
    }
  };

  if (loading) return (
    <div className="p-4 flex flex-col gap-6 animate-pulse">
      <div className="h-10 bg-surface-container rounded-lg w-full"></div>
      <div className="grid grid-cols-1 gap-4">
        <div className="h-20 bg-surface-container rounded-xl"></div>
        <div className="h-20 bg-surface-container rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-500 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-headline-md text-on-surface font-bold">Minha Coleção</h1>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Buscar jogador..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-primary outline-none shadow-sm"
          />
          <select 
            value={filterSelecao}
            onChange={(e) => setFilterSelecao(e.target.value)}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-lg focus:ring-2 focus:ring-primary outline-none shadow-sm"
          >
            <option value="Todas">Todas as Seleções</option>
            {selecoes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStickers.map(sticker => (
          <StickerCard 
            key={sticker.id} 
            sticker={sticker} 
            onClick={() => openForm(sticker)}
            onDelete={(e) => handleDelete(e, sticker.id)}
          />
        ))}
      </div>

      {filteredStickers.length === 0 && (
        <div className="text-center py-20 text-on-surface-variant italic bg-surface-container/30 rounded-2xl border-2 border-dashed border-outline-variant">
          Nenhuma figurinha encontrada.
        </div>
      )}
    </div>
  );
};

export const StickerCard = ({ sticker, onClick, onDelete, large }) => {
  const isLegend = sticker.tipo === 'legend';
  const isShiny = sticker.tipo === 'brilhante';
  const isNotStuck = !sticker.colada;

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden transition-all cursor-pointer group active:scale-95
        ${large ? 'p-8 rounded-2xl border-4 min-h-[220px] flex flex-col justify-center' : 'p-4 rounded-xl border flex items-center gap-4'}
        ${isLegend 
          ? 'bg-gradient-to-br from-secondary-fixed/20 to-surface border-secondary-fixed ring-1 ring-secondary-fixed/30 shadow-md' 
          : 'bg-surface border-outline-variant shadow-sm hover:shadow-md'}
        ${isNotStuck ? 'opacity-40 border-dashed grayscale' : 'opacity-100'}
      `}
    >
      {isShiny && <div className="absolute inset-0 shiny-overlay z-0 opacity-40"></div>}
      
      <div className={`
        ${large ? 'w-24 h-24 mb-6' : 'w-12 h-12'} 
        rounded-full flex items-center justify-center font-bold flex-shrink-0 z-10
        ${isLegend ? 'bg-secondary-container text-on-secondary-container shadow-sm' : 'bg-surface-container-high text-on-surface'}
      `}>
        {sticker.jogador.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
      </div>

      <div className="flex flex-col flex-1 min-w-0 z-10">
        <div className={`font-bold text-on-surface truncate ${large ? 'text-4xl mb-2' : 'text-title-lg'}`}>
          {sticker.jogador}
        </div>
        <div className={`text-on-surface-variant truncate ${large ? 'text-2xl' : 'text-body-md'}`}>
          {sticker.selecao} {isLegend && '• Legend'}
        </div>
      </div>

      <div className="flex items-center gap-2 z-10">
        {sticker.repetida && (
          <div className="bg-primary text-on-primary px-2 py-1 rounded-full font-label-sm text-label-sm shadow-sm font-bold">
            +1
          </div>
        )}
        {!large && (
          <button 
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-2 text-error hover:bg-error/10 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Collection;
