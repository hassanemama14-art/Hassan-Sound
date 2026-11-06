import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, Headphones, FileText, Settings, Code } from 'lucide-react';

interface NavigationProps {
  onOpenCodeModal: () => void;
}

export const BottomNavigation: React.FC<NavigationProps> = ({ onOpenCodeModal }) => {
  const { currentRoute, setRoute, t, activeBook, playback } = useApp();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'library', label: t('library'), icon: BookOpen },
    { id: 'player', label: t('player'), icon: Headphones, badge: playback.isPlaying },
    { id: 'reader', label: t('reader'), icon: FileText },
    { id: 'settings', label: t('settings'), icon: Settings }
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101321]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className="flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[44px] relative group"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'text-[#9b82ff] scale-110' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {'badge' in item && item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7657F6] ring-2 ring-[#101321]" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#9b82ff] font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
