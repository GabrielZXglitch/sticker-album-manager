import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const StickerForm = ({ user, onClose, editingSticker }) => {
  const [jogador, setJogador] = useState(editingSticker?.jogador || '');
  const [selecao, setSelecao] = useState(editingSticker?.selecao || '');
  const [tipo, setTipo] = useState(editingSticker?.tipo || 'comum');
  const [repetida, setRepetida] = useState(editingSticker?.repetida || false);
  const [colada, setColada] = useState(editingSticker?.colada || false);
  const [selecoes, setSelecoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSelecoes = async () => {
      const q = query(collection(db, 'selecoes'), orderBy('name'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => doc.data().name);
      setSelecoes(list);
      if (!editingSticker && list.length > 0) setSelecao(list[0]);
    };
    fetchSelecoes();
  }, [editingSticker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const stickerData = {
        jogador,
        selecao,
        tipo,
        repetida,
        colada,
        updatedAt: new Date(),
      };

      if (editingSticker) {
        await updateDoc(doc(db, `users/${user.uid}/figurinhas`, editingSticker.id), stickerData);
      } else {
        await addDoc(collection(db, `users/${user.uid}/figurinhas`), {
          ...stickerData,
          id: uuidv4(),
          createdAt: new Date(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving sticker", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm animate-in fade-in duration-300">
      <form 
        onSubmit={handleSubmit}
        className="bg-surface border border-outline-variant rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-headline-md text-on-surface font-bold">
            {editingSticker ? 'Editar Figurinha' : 'Adicionar Figurinha'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-lg text-on-surface-variant uppercase">Nome do Jogador</label>
            <input 
              required
              type="text" 
              value={jogador}
              onChange={(e) => setJogador(e.target.value)}
              className="bg-surface-container px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary text-body-lg"
              placeholder="Ex: Lionel Messi"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-lg text-on-surface-variant uppercase">Seleção</label>
            <select 
              value={selecao}
              onChange={(e) => setSelecao(e.target.value)}
              className="bg-surface-container px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary text-body-lg"
            >
              {selecoes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-lg text-on-surface-variant uppercase">Tipo</label>
            <div className="flex gap-2">
              <TypeButton label="Comum" active={tipo === 'comum'} onClick={() => setTipo('comum')} />
              <TypeButton label="Legend" active={tipo === 'legend'} onClick={() => setTipo('legend')} />
              <TypeButton label="Brilhante" active={tipo === 'brilhante'} onClick={() => setTipo('brilhante')} />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Toggle label="Figurinha repetida" checked={repetida} onChange={setRepetida} icon="content_copy" />
            <Toggle label="Colada no álbum" checked={colada} onChange={setColada} icon="book" />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg hover:bg-primary-container transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Figurinha'}
        </button>
      </form>
    </div>
  );
};

const TypeButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg text-label-lg border transition-all ${
      active ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary/50'
    }`}
  >
    {label}
  </button>
);

const Toggle = ({ label, checked, onChange, icon }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
      <span className={`material-symbols-outlined ${checked ? 'text-primary' : 'text-on-surface-variant'}`}>{icon}</span>
      <span className="text-body-lg text-on-surface">{label}</span>
    </div>
    <div 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-outline-variant'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`}></div>
    </div>
  </label>
);

export default StickerForm;
