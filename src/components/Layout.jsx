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

  const getInitials = (email) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm h-14">
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
          <div className="font-display text-title-lg text-primary tracking-tight">StickerAlbum</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-bold">
              {getInitials(user.email)}
            </div>
            <button onClick={handleLogout} className="text-on-surface-variant hover:text-primary transition-colors p-1">
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14 pb-24 min-h-screen">
        {/* Main Content */}
        <main className="p-0 max-w-7xl mx-auto w-full">
          <Outlet context={{ openForm }} />
        </main>
      </div>

      {/* FAB - Above Bottom Bar */}
      <button 
        onClick={() => openForm()}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all active:scale-95 z-50"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Bottom Nav - Fixed */}
      <nav className="fixed bottom-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center h-20 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-4 pt-2">
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

const MobileNavLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 p-2 transition-colors flex-1 ${
        isActive ? 'text-primary' : 'text-on-surface-variant'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
        <span className="text-label-sm font-bold">{label}</span>
      </>
    )}
  </NavLink>
);

export default Layout;
