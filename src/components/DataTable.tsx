import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  Layers,
  Search,
  Share2,
  Table as TableIcon,
} from 'lucide-react';
import { FlattenedRecord, RawCourseData } from '../types/data';
import { TOTAL_MATRICULAS } from '../data/coursesData';

interface DataTableProps {
  courses: RawCourseData[];
  records: FlattenedRecord[];
  onExport: () => void;
  onSelectCourse: (course: RawCourseData) => void;
  onSelectDr: (dr: string) => void;
}

type SortField = 'curso' | 'dr' | 'matriculas' | 'eixo' | 'regiao';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({
  courses,
  records,
  onExport,
  onSelectCourse,
  onSelectDr,
}) => {
  const [viewMode, setViewMode] = useState<'consolidated' | 'detailed'>('consolidated');
  const [sortField, setSortField] = useState<SortField>('matriculas');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [localSearch, setLocalSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered and sorted consolidated courses
  const sortedCourses = useMemo(() => {
    let list = [...courses];
    if (localSearch) {
      const q = localSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.curso.toLowerCase().includes(q) ||
          c.drRaw.toLowerCase().includes(q) ||
          c.eixoTecnologico.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: string | number = a.curso;
      let valB: string | number = b.curso;

      if (sortField === 'matriculas') {
        valA = a.totalMatriculas;
        valB = b.totalMatriculas;
      } else if (sortField === 'dr') {
        valA = a.drRaw;
        valB = b.drRaw;
      } else if (sortField === 'eixo') {
        valA = a.eixoTecnologico;
        valB = b.eixoTecnologico;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [courses, localSearch, sortField, sortOrder]);

  // Filtered and sorted detailed records
  const sortedRecords = useMemo(() => {
    let list = [...records];
    if (localSearch) {
      const q = localSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.curso.toLowerCase().includes(q) ||
          r.dr.toLowerCase().includes(q) ||
          r.drNome.toLowerCase().includes(q) ||
          r.eixoTecnologico.toLowerCase().includes(q) ||
          r.regiao.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: string | number = a.curso;
      let valB: string | number = b.curso;

      if (sortField === 'matriculas') {
        valA = a.matriculas;
        valB = b.matriculas;
      } else if (sortField === 'dr') {
        valA = a.dr;
        valB = b.dr;
      } else if (sortField === 'eixo') {
        valA = a.eixoTecnologico;
        valB = b.eixoTecnologico;
      } else if (sortField === 'regiao') {
        valA = a.regiao;
        valB = b.regiao;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [records, localSearch, sortField, sortOrder]);

  const totalFilteredMatriculas =
    viewMode === 'consolidated'
      ? sortedCourses.reduce((sum, c) => sum + c.totalMatriculas, 0)
      : sortedRecords.reduce((sum, r) => sum + r.matriculas, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
              <TableIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002855]">
                Planilha de Matrículas e Detalhamento
              </h3>
              <p className="text-xs text-slate-500">
                Visualização tabular com ordenação e exportação para Excel
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('consolidated')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'consolidated'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consolidada ({courses.length})
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por DR ({records.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filtrar tabela..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005CAA]"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#005CAA] hover:bg-[#004587] rounded-lg transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar XLSX</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {viewMode === 'consolidated' ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-semibold select-none">
              <tr>
                <th className="py-3 px-4 w-12 text-slate-400">#</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('curso')}
                >
                  <div className="flex items-center gap-1">
                    <span>Curso Técnico</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('eixo')}
                >
                  <div className="flex items-center gap-1">
                    <span>Eixo Tecnológico (CNCT)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('dr')}
                >
                  <div className="flex items-center gap-1">
                    <span>DRs Ofertantes</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Tipo de Oferta</th>
                <th className="py-3 px-4">Matrículas por DR (Original)</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('matriculas')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Matrículas</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCourses.map((c, idx) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCourse(c)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-[#005CAA] transition-colors">
                    {c.curso}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {c.eixoTecnologico}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {c.drRaw}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {c.isMultiDR ? (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        Multi-DR ({c.drsOfertantes.length})
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium">
                        DR Único
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                    {c.matriculasRaw}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#002855] tabular-nums text-sm">
                    {c.totalMatriculas.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-right">
                  TOTAL DE MATRÍCULAS SELECIONADAS:
                </td>
                <td className="py-3 px-4 text-right font-mono text-base text-[#005CAA] tabular-nums">
                  {totalFilteredMatriculas.toLocaleString('pt-BR')}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-semibold select-none">
              <tr>
                <th className="py-3 px-4 w-12 text-slate-400">#</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('dr')}
                >
                  <div className="flex items-center gap-1">
                    <span>DR</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Estado</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('regiao')}
                >
                  <div className="flex items-center gap-1">
                    <span>Região</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('curso')}
                >
                  <div className="flex items-center gap-1">
                    <span>Curso Técnico</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('eixo')}
                >
                  <div className="flex items-center gap-1">
                    <span>Eixo Tecnológico</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('matriculas')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Matrículas no DR</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Total do Curso</th>
                <th className="py-3 px-4 text-right">% no DR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRecords.map((r, idx) => {
                const pct = (
                  (r.matriculas / r.totalCursoMatriculas) *
                  100
                ).toFixed(1);

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#005CAA]">
                      <button
                        onClick={() => onSelectDr(r.dr)}
                        className="hover:underline cursor-pointer"
                      >
                        {r.dr}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {r.drNome}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {r.regiao}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {r.curso}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.eixoTecnologico}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#002855] tabular-nums">
                      {r.matriculas.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {r.totalCursoMatriculas.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-right">
                  TOTAL DE MATRÍCULAS SELECIONADAS:
                </td>
                <td className="py-3 px-4 text-right font-mono text-base text-[#005CAA] tabular-nums">
                  {totalFilteredMatriculas.toLocaleString('pt-BR')}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};
