import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, ExternalLink, Filter, Share2, Users } from 'lucide-react';
import { DRS_AGGREGATES, TOTAL_MATRICULAS } from '../data/coursesData';
import { RawCourseData } from '../types/data';

interface DrAnalysisProps {
  onSelectDr: (dr: string) => void;
  onSelectCourse: (courseName: string) => void;
  selectedDr: string;
}

export const DrAnalysis: React.FC<DrAnalysisProps> = ({
  onSelectDr,
  onSelectCourse,
  selectedDr,
}) => {
  const [expandedDrs, setExpandedDrs] = useState<Record<string, boolean>>({
    MG: true,
    PR: true,
    SP: true,
  });

  const toggleExpand = (sigla: string) => {
    setExpandedDrs((prev) => ({ ...prev, [sigla]: !prev[sigla] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#002855]">
            Análise por Departamento Regional (DR)
          </h2>
          <p className="text-xs text-slate-500">
            Detalhamento individual dos 10 DRs do SENAI com ofertas fora da base nacional
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Total Mapeado:</span>
          <span className="font-mono tabular-nums font-bold text-[#005CAA]">
            {TOTAL_MATRICULAS.toLocaleString('pt-BR')} matrículas
          </span>
        </div>
      </div>

      {/* Grid of Regional Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DRS_AGGREGATES.map((dr) => {
          const isSelected = selectedDr === dr.sigla;
          const isExpanded = !!expandedDrs[dr.sigla];

          return (
            <div
              key={dr.sigla}
              className={`bg-white border rounded-xl shadow-xs transition-all ${
                isSelected
                  ? 'border-[#005CAA] ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005CAA] font-mono font-black text-lg">
                      {dr.sigla}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {dr.nome}
                        </h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {dr.regiao}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Capital: {dr.capital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDr(isSelected ? 'all' : dr.sigla)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#005CAA] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={isSelected ? 'Remover filtro' : 'Filtrar por este DR'}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Filtrado' : 'Filtrar'}</span>
                    </button>
                    <button
                      onClick={() => toggleExpand(dr.sigla)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                      aria-label="Expandir/recolher cursos"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Matrículas
                    </span>
                    <span className="text-base font-mono font-bold text-[#002855] tabular-nums">
                      {dr.totalMatriculas.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      % Nacional
                    </span>
                    <span className="text-base font-mono font-bold text-[#005CAA] tabular-nums">
                      {dr.percentualNacional}%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Cursos
                    </span>
                    <span className="text-base font-mono font-bold text-slate-800 tabular-nums">
                      {dr.totalCursos}
                    </span>
                  </div>
                </div>

                {/* Expanded Course List */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-semibold text-slate-600 block">
                      Cursos ofertados neste Regional:
                    </span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {dr.cursos.map((c, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectCourse(c.curso)}
                          className="p-2 rounded-lg bg-slate-50/80 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {c.isMultiDR && (
                              <span title="Oferta compartilhada com outros DRs">
                                <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              </span>
                            )}
                            <span className="font-semibold text-slate-800 group-hover:text-[#005CAA] transition-colors truncate">
                              {c.curso}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 font-mono">
                            <span className="font-bold text-slate-900 tabular-nums">
                              {c.matriculas.toLocaleString('pt-BR')}
                            </span>
                            <span className="text-[10px] text-slate-400">mat.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
