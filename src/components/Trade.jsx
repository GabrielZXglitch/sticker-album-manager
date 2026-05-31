import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { StickerCard } from './Collection';

const Trade = ({ user }) => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, `users/${user.uid}/figurinhas`), 
      where('repetida', '==', true),
      orderBy('jogador')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStickers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Trade listener error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.uid]);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-top duration-500 p-4">
      <div>
        <h1 className="text-headline-md text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">swap_horiz</span>
          Central de Trocas
        </h1>
        <p className="text-body-md text-on-surface-variant">Mostre estas figurinhas nos eventos de troca!</p>
      </div>

      <div className="flex flex-col gap-4">
        {stickers.map(sticker => (
          <StickerCard 
            key={sticker.id} 
            sticker={sticker} 
            large 
          />
        ))}
      </div>

      {stickers.length === 0 && (
        <div className="text-center py-20 bg-surface-container/30 rounded-2xl border-2 border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">content_copy</span>
          <p className="text-body-lg text-on-surface-variant italic">Sem figurinhas repetidas no momento.</p>
        </div>
      )}
    </div>
  );
};

export default Trade;
