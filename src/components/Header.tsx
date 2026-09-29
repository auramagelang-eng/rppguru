import React from 'react';
import {
  FileText,
  Upload,
  ListOrdered,
  Sparkles,
  Eye,
  History,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RPPDocument, ProtaData } from '../types/rpp';

export type ActiveTab =
  | 'dashboard'
  | 'identitas'
  | 'import-prota'
  | 'daftar-cp'
  | 'generator'
  | 'preview'
  | 'riwayat'
  | 'pengaturan';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRpp: RPPDocument | null;
  currentProta: ProtaData | null;
  onQuickDownload?: () => void;
  autoSavedTime?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRpp,
  currentProta,
  onQuickDownload,
  autoSavedTime
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'identitas', label: 'Data Identitas', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'import-prota', label: 'Import PROTA', icon: <Upload className="w-4 h-4" /> },
    {
      id: 'daftar-cp',
      label: 'Daftar CP',
      icon: <ListOrdered className="w-4 h-4" />,
      badge: currentProta ? `${currentProta.items.length}` : undefined
    },
    { id: 'generator', label: 'Generator RPP', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview RPP', icon: <Eye className="w-4 h-4" /> },
    { id: 'riwayat', label: 'Riwayat Dokumen', icon: <History className="w-4 h-4" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs print:hidden">
      {/* Top Banner with School Identity */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
              SMK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-amber-300">
                  SMK NEGERI 2 MAGELANG
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-blue-800/80 rounded text-[10px] text-blue-200">
                  Kurikulum Merdeka 2026/2027
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-1.5">
                RPP AUTO GENERATOR
                <span className="text-xs font-normal text-slate-300 hidden lg:inline">
                  — Perencanaan Pembelajaran Mendalam
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="flex items-center gap-3 text-xs">
            {autoSavedTime && (
              <div className="flex items-center gap-1 text-emerald-300 bg-blue-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tersimpan {autoSavedTime}</span>
              </div>
            )}

            {activeRpp ? (
              <div className="flex items-center gap-2 bg-blue-800/60 px-3 py-1 rounded-lg border border-blue-700/50">
                <span className="text-slate-300 hidden sm:inline">Aktif:</span>
                <span className="font-semibold text-amber-200 truncate max-w-[140px] sm:max-w-[200px]">
                  {activeRpp.guru.mataPelajaran} ({activeRpp.guru.kelas})
                </span>
                {onQuickDownload && (
                  <button
                    onClick={onQuickDownload}
                    className="p-1 hover:bg-blue-700 rounded text-sky-200 hover:text-white transition-colors"
                    title="Unduh PDF RPP yang Sedang Aktif"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-300 bg-blue-950/40 px-2.5 py-1 rounded-md text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Pilih CP untuk membuat RPP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-900 text-sky-200' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
