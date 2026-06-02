import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Sticker {
  id: string;
  codigo: string;
  secao: string;
  tipo: string;
  quantidade: number;
}

interface StickerContextType {
  stickers: Sticker[];
  loading: boolean;
  updateStickerQuantity: (id: string, delta: number) => Promise<void>;
  stats: {
    faltam: number;
    completas: number;
    repetidas: number;
  };
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

export const StickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'figurinhas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stickerData: Sticker[] = [];
      snapshot.forEach((doc) => {
        stickerData.push({ id: doc.id, ...doc.data() } as Sticker);
      });
      setStickers(stickerData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStickerQuantity = async (id: string, delta: number) => {
    const stickerRef = doc(db, 'figurinhas', id);
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;

    const newQuantity = Math.max(0, sticker.quantidade + delta);
    
    // O onSnapshot cuidará da atualização da UI assim que o Firestore confirmar ou via cache local.
    // O requisito pede tratamento no componente para Optimistic UI com rollback em caso de erro.
    await updateDoc(stickerRef, {
      quantidade: newQuantity
    });
  };

  const stats = useMemo(() => {
    return {
      faltam: stickers.filter(s => s.quantidade === 0).length,
      completas: stickers.filter(s => s.quantidade >= 1).length,
      repetidas: stickers.reduce((acc, s) => s.quantidade > 1 ? acc + (s.quantidade - 1) : acc, 0)
    };
  }, [stickers]);

  return (
    <StickerContext.Provider value={{ stickers, loading, updateStickerQuantity, stats }}>
      {children}
    </StickerContext.Provider>
  );
};

export const useStickers = () => {
  const context = useContext(StickerContext);
  if (!context) throw new Error('useStickers must be used within a StickerProvider');
  return context;
};
