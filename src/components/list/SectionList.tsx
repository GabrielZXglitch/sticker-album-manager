import React from 'react';
import { useStickers } from '../../context/StickerContext';
import type { Sticker } from '../../context/StickerContext';
import StickerRow from './StickerRow';

interface SectionListProps {
  filter: 'Todas' | 'Faltam' | 'Repetidas';
}

const SectionList: React.FC<SectionListProps> = ({ filter }) => {
  const { stickers, loading } = useStickers();

  const filteredStickers = React.useMemo(() => {
    switch (filter) {
      case 'Faltam':
        return stickers.filter(s => s.quantidade === 0);
      case 'Repetidas':
        return stickers.filter(s => s.quantidade > 1);
      default:
        return stickers;
    }
  }, [stickers, filter]);

  const groupedStickers = React.useMemo(() => {
    return filteredStickers.reduce((groups, sticker) => {
      const section = sticker.secao || 'Outros';
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(sticker);
      return groups;
    }, {} as Record<string, Sticker[]>);
  }, [filteredStickers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sections = Object.keys(groupedStickers).sort();

  if (sections.length === 0) {
    return (
      <div className="text-center p-10 text-slate-500">
        Nenhuma figurinha encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-5 space-y-8 pb-24">
      {sections.map(section => (
        <section key={section}>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
            {section}
          </h2>
          <div className="space-y-3">
            {groupedStickers[section]
              .sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }))
              .map(sticker => (
                <StickerRow key={sticker.id} sticker={sticker} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default SectionList;
