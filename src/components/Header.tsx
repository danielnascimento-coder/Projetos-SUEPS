import React from 'react';
import { Download, Info, FileSpreadsheet } from 'lucide-react';

export type ActiveTab = 'overview' | 'drs' | 'courses' | 'map' | 'table';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCredits: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCredits,
  onExport,
  isExporting = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#005CAA] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm select-none">
              S
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
              className="text-base font-bold tracking-tight text-[#002855] hover:text-[#005CAA] transition-colors whitespace-nowrap"
            >
              SENAI · Cursos Fora da Base
            </a>
          </div>

          {/* Zone 2: 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-[#005CAA] bg-blue-50/80 border-b-2 border-[#005CAA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('drs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'drs'
                  ? 'text-[#005CAA] bg-blue-50/80 border-b-2 border-[#005CAA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Regionais (DRs)
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'text-[#005CAA] bg-blue-50/80 border-b-2 border-[#005CAA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cursos & Eixos
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'map'
                  ? 'text-[#005CAA] bg-blue-50/80 border-b-2 border-[#005CAA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Mapa Regional
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'table'
                  ? 'text-[#005CAA] bg-blue-50/80 border-b-2 border-[#005CAA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tabela Analítica
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCredits}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#005CAA] hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              title="Equipe de Itinerários Nacionais do SENAI"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Créditos</span>
            </button>
            <button
              onClick={onExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#005CAA] hover:bg-[#004587] rounded-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.98] whitespace-nowrap disabled:opacity-60"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar XLSX</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-[#005CAA] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('drs')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'drs'
                ? 'bg-blue-50 text-[#005CAA] font-semibold'
                : 'text-slate-600'
            }`}
          >
            DRs
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-blue-50 text-[#005CAA] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-blue-50 text-[#005CAA] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-blue-50 text-[#005CAA] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Tabela
          </button>
        </div>
      </div>
    </header>
  );
};
