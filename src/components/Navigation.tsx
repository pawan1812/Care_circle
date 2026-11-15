import React from 'react';
import { useCare } from '../context/useCare';
import {
  Home,
  Pill,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  History,
  ShieldCheck,
} from 'lucide-react';

export type ActiveTab =
  | 'home'
  | 'today'
  | 'medications'
  | 'insights'
  | 'appointments'
  | 'circle'
  | 'notes'
  | 'privacy'
  | 'activity';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { isElderMode } = useCare();

  // ELDER MODE NAVIGATION (PRD Section 19.6: "Elders get no navigation menu beyond three or four large labelled buttons")
  if (isElderMode) {
    return (
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-emerald-200 py-3 px-4 shadow-xl">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          <button
            onClick={() => onTabChange('home')}
            className={`elder-touch-target flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTab === 'home' || activeTab === 'today'
                ? 'bg-emerald-700 text-white font-extrabold shadow-md scale-[1.02]'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <Pill className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm">Medicines</span>
          </button>

          <button
            onClick={() => onTabChange('appointments')}
            className={`elder-touch-target flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTab === 'appointments'
                ? 'bg-emerald-700 text-white font-extrabold shadow-md scale-[1.02]'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm">Doctor Visits</span>
          </button>

          <button
            onClick={() => onTabChange('circle')}
            className={`elder-touch-target flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTab === 'circle' || activeTab === 'privacy'
                ? 'bg-emerald-700 text-white font-extrabold shadow-md scale-[1.02]'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm">My Circle</span>
          </button>
        </div>
      </div>
    );
  }

  // STANDARD CARETAKER / FAMILY NAVIGATION BAR
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'today', label: 'Today’s Doses', icon: <Pill className="w-4 h-4" /> },
    { id: 'medications', label: 'All Medications', icon: <Pill className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights & Adherence', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'appointments', label: 'Doctor Visits', icon: <Calendar className="w-4 h-4" /> },
    { id: 'circle', label: 'Care Circle', icon: <Users className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes & Tasks', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'activity', label: 'Timeline', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

