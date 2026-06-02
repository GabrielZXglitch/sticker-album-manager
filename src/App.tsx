import { useState } from 'react';
import Header from './components/layout/Header';
import Statistics from './components/dashboard/Statistics';
import NavTabs from './components/filters/NavTabs';
import type { FilterType } from './components/filters/NavTabs';
import SectionList from './components/list/SectionList';
import { StickerProvider } from './context/StickerContext';

function App() {
  const [filter, setFilter] = useState<FilterType>('Todas');

  return (
    <StickerProvider>
      <div className="min-h-screen bg-surface">
        <Header />
        <main>
          <Statistics />
          <NavTabs activeFilter={filter} onFilterChange={setFilter} />
          <SectionList filter={filter} />
        </main>
      </div>
    </StickerProvider>
  );
}

export default App;
