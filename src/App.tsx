import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/Navigation';
import { MiniPlayer } from './components/MiniPlayer';
import { HomeScreen } from './components/HomeScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { PlayerScreen } from './components/PlayerScreen';
import { ReaderScreen } from './components/ReaderScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ImportModal } from './components/ImportModal';
import { AndroidProjectModal } from './components/AndroidProjectModal';

const MainLayout: React.FC = () => {
  const { currentRoute, language } = useApp();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#101321] text-slate-100 flex flex-col selection:bg-[#7657F6]/30 selection:text-white">
      {/* Top Bar Contract compliant Header */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 w-full">
        {currentRoute === 'home' && (
          <HomeScreen
            onOpenImport={() => setIsImportOpen(true)}
            onOpenCodeModal={() => setIsCodeModalOpen(true)}
          />
        )}
        {currentRoute === 'library' && (
          <LibraryScreen onOpenImport={() => setIsImportOpen(true)} />
        )}
        {currentRoute === 'player' && <PlayerScreen />}
        {currentRoute === 'reader' && <ReaderScreen />}
        {currentRoute === 'settings' && <SettingsScreen />}
      </main>

      {/* Floating Mini Player (only when reading in background) */}
      <MiniPlayer />

      {/* Mobile Bottom Navigation (compliant with thumb-zone specs) */}
      <BottomNavigation onOpenCodeModal={() => setIsCodeModalOpen(true)} />

      {/* SAF Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Complete Android Studio Project (Kotlin & Compose) Code Inspector & ZIP Exporter */}
      <AndroidProjectModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
