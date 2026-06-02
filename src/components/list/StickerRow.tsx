import React from 'react';
import { useStickers } from '../../context/StickerContext';
import type { Sticker } from '../../context/StickerContext';
import { Plus, Minus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StickerRowProps {
  sticker: Sticker;
}

const StickerRow: React.FC<StickerRowProps> = ({ sticker }) => {
  const { updateStickerQuantity } = useStickers();
  const [localQuantity, setLocalQuantity] = React.useState(sticker.quantidade);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Sync with context if external changes occur (though context will be updated by local update too)
  React.useEffect(() => {
    setLocalQuantity(sticker.quantidade);
  }, [sticker.quantidade]);

  const handleUpdate = async (delta: number) => {
    if (isUpdating) return;
    
    const previousQuantity = localQuantity;
    const newQuantity = Math.max(0, previousQuantity + delta);
    
    if (newQuantity === previousQuantity) return;

    // Optimistic Update
    setLocalQuantity(newQuantity);
    setIsUpdating(true);

    try {
      await updateStickerQuantity(sticker.id, delta);
    } catch (error) {
      console.error("Failed to update sticker:", error);
      // Rollback
      setLocalQuantity(previousQuantity);
      alert("Erro ao atualizar. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isMissing = localQuantity === 0;
  const isDuplicate = localQuantity > 1;

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 transition-all duration-200",
      isMissing && "opacity-60",
      isDuplicate && "border-emerald-100 bg-emerald-50/30"
    )}>
      <div className="flex flex-col">
        <span className={cn(
          "text-lg font-bold tracking-tight transition-colors",
          isMissing ? "text-slate-400" : "text-slate-900",
          isDuplicate && "text-emerald-700"
        )}>
          {sticker.codigo}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {sticker.tipo}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleUpdate(-1)}
          disabled={isMissing || isUpdating}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 transition-colors",
            "active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Minus size={16} />
        </button>

        <div className="flex flex-col items-center min-w-[24px]">
          <span className={cn(
            "text-lg font-bold",
            isDuplicate ? "text-emerald-600" : "text-slate-900"
          )}>
            {localQuantity}
          </span>
          {isDuplicate && (
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter leading-none">
              +{localQuantity - 1}
            </span>
          )}
        </div>

        <button
          onClick={() => handleUpdate(1)}
          disabled={isUpdating}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white transition-colors",
            "active:bg-primary-container disabled:opacity-50"
          )}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default StickerRow;
