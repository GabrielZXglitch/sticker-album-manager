import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FilterType = 'Todas' | 'Faltam' | 'Repetidas';

interface NavTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeFilter, onFilterChange }) => {
  const tabs: FilterType[] = ['Todas', 'Faltam', 'Repetidas'];

  return (
    <nav className="max-w-md mx-auto px-5 mt-2">
      <div className="flex bg-slate-200/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilterChange(tab)}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
              activeFilter === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavTabs;
