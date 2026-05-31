import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import StickerForm from './StickerForm';

const Layout = ({ user }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSticker, setEditingSticker] = useState(null);

  const handleLogout = () => signOut(auth);

  const openForm = (sticker = null) => {
    setEditingSticker(sticker);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm h-16">
        <div className="flex justify-between items-center px-4 md:px-container-padding h-full max-w-7xl mx-auto">
          <div className="font-display text-headline-md text-primary tracking-tight">StickerAlbum</div>
          <div className="flex items-center gap-base">
            <span className="hidden sm:block text-label-sm text-on-surface-variant">{user.email}</span>
            <button onClick={handleLogout} className="text-on-surface-variant hover:text-primary transition-colors p-2 flex items-center gap-1">
              <span className="hidden sm:inline text-label-sm uppercase">Sair</span>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="h-full w-64 fixed left-0 top-16 hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant p-container-padding gap-base z-40">
          <nav className="flex flex-col gap-2">
            <NavButton to="/" icon="dashboard" label="Início" />
            <NavButton to="/colecao" icon="auto_stories" label="Coleção" />
            <NavButton to="/legends" icon="stars" label="Legends" />
            <NavButton to="/troca" icon="swap_horiz" label="Troca" />
          </nav>
          <div className="mt-auto pt-8">
            <button 
              onClick={() => openForm()}
              className="w-full flex items-center justify-center bg-primary text-on-primary font-label-lg px-4 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm"
            >
              Adicionar Figurinha
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-container-padding max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          <Outlet context={{ openForm }} />
        </main>
      </div>

      {/* FAB - Mobile Only */}
      <button 
        onClick={() => openForm()}
        className="fixed bottom-24 right-4 lg:hidden w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-colors z-50"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Bottom Nav - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center h-20 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-4 pt-2">
        <MobileNavLink to="/" icon="dashboard" label="Início" />
        <MobileNavLink to="/colecao" icon="auto_stories" label="Coleção" />
        <MobileNavLink to="/legends" icon="stars" label="Legends" />
        <MobileNavLink to="/troca" icon="swap_horiz" label="Troca" />
      </nav>

      {/* Sticker Form Modal */}
      {isFormOpen && (
        <StickerForm 
          user={user} 
          onClose={() => setIsFormOpen(false)} 
          editingSticker={editingSticker}
        />
      )}
    </div>
  );
};

const NavButton = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 p-3 rounded-xl font-label-lg transition-all ${
        isActive 
        ? 'bg-secondary-container text-on-secondary-container font-bold scale-95' 
        : 'text-on-surface-variant hover:bg-surface-container-high'
      }`
    }
  >
    <span className="material-symbols-outlined">{icon}</span>
    {label}
  </NavLink>
);

const MobileNavLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 p-2 transition-colors ${
        isActive ? 'text-primary' : 'text-on-surface-variant'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
        <span className="text-label-sm">{label}</span>
      </>
    )}
  </NavLink>
);

export default Layout;
