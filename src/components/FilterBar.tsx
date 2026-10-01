import React from 'react';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import {
  DEPARTAMENTOS_REGIONAIS,
  EIXOS_TECNOLOGICOS,
  REGIOES_BRASIL,
} from '../data/coursesData';
import { FilterState } from '../types/data';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatchesCourses: number;
  totalMatchesMatriculas: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalMatchesCourses,
  totalMatchesMatriculas,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.eixo !== 'all' ||
    filters.regiao !== 'all' ||
    filters.dr !== 'all' ||
    filters.tipoOferta !== 'all' ||
    filters.faixaMatricula !== 'all';

  const resetFilters = () => {
    setFilters({
      search: '',
      eixo: 'all',
      regiao: 'all',
      dr: 'all',
      tipoOferta: 'all',
      faixaMatricula: 'all',
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#002855]">
              Filtros Analíticos de Matrículas
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{totalMatchesCourses} cursos selecionados</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-slate-700">
                {totalMatchesMatriculas.toLocaleString('pt-BR')} matrículas
              </span>
            </div>
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005CAA] hover:text-[#002855] px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors self-start lg:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redefinir filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
        {/* Search */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Pesquisa por Curso ou DR
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Ex: Portos, Design, SP, MG..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005CAA] focus:border-transparent transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Eixo Tecnológico (CNCT) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Eixo Tecnológico (CNCT)
          </label>
          <select
            value={filters.eixo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, eixo: e.target.value }))
            }
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005CAA] focus:border-transparent transition-all"
          >
            <option value="all">Todos os Eixos</option>
            {EIXOS_TECNOLOGICOS.map((e) => (
              <option key={e.nome} value={e.nome}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Região do Brasil */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Macrorregião
          </label>
          <select
            value={filters.regiao}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                regiao: e.target.value,
                // If selected region doesn't match selected DR, reset DR
                dr:
                  prev.dr !== 'all' &&
                  DEPARTAMENTOS_REGIONAIS[prev.dr]?.regiao !== e.target.value &&
                  e.target.value !== 'all'
                    ? 'all'
                    : prev.dr,
              }))
            }
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005CAA] focus:border-transparent transition-all"
          >
            <option value="all">Todas as Regiões</option>
            {REGIOES_BRASIL.map((r) => (
              <option key={r} value={r}>
                Região {r}
              </option>
            ))}
          </select>
        </div>

        {/* DR / Estado */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Departamento Regional
          </label>
          <select
            value={filters.dr}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dr: e.target.value }))
            }
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005CAA] focus:border-transparent transition-all"
          >
            <option value="all">Todos os DRs</option>
            {Object.values(DEPARTAMENTOS_REGIONAIS)
              .filter(
                (d) => filters.regiao === 'all' || d.regiao === filters.regiao
              )
              .map((d) => (
                <option key={d.sigla} value={d.sigla}>
                  {d.sigla} - {d.nome}
                </option>
              ))}
          </select>
        </div>

        {/* Tipo de Oferta */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Modalidade de Oferta
          </label>
          <select
            value={filters.tipoOferta}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                tipoOferta: e.target.value as FilterState['tipoOferta'],
              }))
            }
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005CAA] focus:border-transparent transition-all"
          >
            <option value="all">Todas as Ofertas</option>
            <option value="multi">Compartilhada (Multi-DR)</option>
            <option value="single">Exclusiva (DR Único)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
