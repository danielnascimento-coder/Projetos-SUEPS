import React from 'react';
import { BookOpen, Building2, Globe2, GraduationCap, Users } from 'lucide-react';
import { TOTAL_CURSOS, TOTAL_DRS, TOTAL_MATRICULAS, TOTAL_REGIOES } from '../data/coursesData';

interface KpiCardsProps {
  currentMatriculas: number;
  currentCoursesCount: number;
  currentDrsCount: number;
  currentRegionsCount: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  currentMatriculas,
  currentCoursesCount,
  currentDrsCount,
  currentRegionsCount,
}) => {
  const pctMatriculas = ((currentMatriculas / TOTAL_MATRICULAS) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Total Matrículas */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Total de Matrículas
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#005CAA]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#002855] tabular-nums tracking-tight">
            {currentMatriculas.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-slate-500 font-medium">alunos</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-semibold text-[#005CAA] font-mono tabular-nums">
            {pctMatriculas}%
          </span>
          <span>do volume total mapeado</span>
        </div>
      </div>

      {/* KPI 2: Cursos Fora da Base */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Cursos Técnicos
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#005CAA]">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
            {currentCoursesCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            de {TOTAL_CURSOS} títulos
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Ofertados sem registro na base nacional</span>
        </div>
      </div>

      {/* KPI 3: DRs Ofertantes */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Departamentos Regionais
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#005CAA]">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
            {currentDrsCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            de {TOTAL_DRS} DRs
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Estados com oferta ativa</span>
        </div>
      </div>

      {/* KPI 4: Macrorregiões */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Macrorregiões
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#005CAA]">
            <Globe2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
            {currentRegionsCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            de {TOTAL_REGIOES} regiões
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Abrangência em 100% das regiões do país</span>
        </div>
      </div>
    </div>
  );
};
