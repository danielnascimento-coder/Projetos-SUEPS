import React, { useState } from 'react';
import {
  BarChart3,
  Layers,
  MapPin,
  TrendingUp,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  COURSES_DATA,
  DRS_AGGREGATES,
  EIXO_AGGREGATES,
  REGIONS_AGGREGATES,
  TOTAL_MATRICULAS,
} from '../data/coursesData';
import { FilterState, RawCourseData } from '../types/data';

interface OverviewChartsProps {
  courses: RawCourseData[];
  onSelectEixo: (eixo: string) => void;
  onSelectDr: (dr: string) => void;
  onSelectRegion: (region: string) => void;
  onSelectCourse: (course: RawCourseData) => void;
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({
  courses,
  onSelectEixo,
  onSelectDr,
  onSelectRegion,
  onSelectCourse,
}) => {
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);

  // Compute stats based on current filtered courses
  const filteredTotalMatriculas = courses.reduce((acc, c) => acc + c.totalMatriculas, 0);

  // Top 8 courses in current filtered view
  const topCourses = [...courses]
    .sort((a, b) => b.totalMatriculas - a.totalMatriculas)
    .slice(0, 8);

  const maxCourseMat = topCourses[0]?.totalMatriculas || 1;

  // Eixo breakdown for filtered courses
  const eixoBreakdown = EIXO_AGGREGATES.map((eixoAgg) => {
    const axisCourses = courses.filter((c) => c.eixoTecnologico === eixoAgg.eixo);
    const sumMat = axisCourses.reduce((sum, c) => sum + c.totalMatriculas, 0);
    const pct = filteredTotalMatriculas > 0
      ? ((sumMat / filteredTotalMatriculas) * 100).toFixed(1)
      : '0';
    return {
      ...eixoAgg,
      currentMatriculas: sumMat,
      currentCoursesCount: axisCourses.length,
      currentPercentage: pct,
    };
  }).filter((e) => e.currentCoursesCount > 0);

  // DR breakdown
  const drMap: Record<string, number> = {};
  courses.forEach((c) => {
    c.ofertas.forEach((of) => {
      drMap[of.dr] = (drMap[of.dr] || 0) + of.matriculas;
    });
  });

  const drBreakdown = DRS_AGGREGATES.map((d) => ({
    ...d,
    currentMatriculas: drMap[d.sigla] || 0,
    currentPercentage: filteredTotalMatriculas > 0
      ? (((drMap[d.sigla] || 0) / filteredTotalMatriculas) * 100).toFixed(1)
      : '0',
  }))
    .filter((d) => d.currentMatriculas > 0)
    .sort((a, b) => b.currentMatriculas - a.currentMatriculas);

  const maxDrMat = drBreakdown[0]?.currentMatriculas || 1;

  return (
    <div className="space-y-6">
      {/* Top Section: Eixos Tecnológicos & Top Cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Eixos Tecnológicos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002855]">
                    Matrículas por Eixo Tecnológico (CNCT)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clique em um eixo para filtrar instantaneamente
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {eixoBreakdown.map((item) => {
                const widthPct = Math.max(
                  (item.currentMatriculas / (filteredTotalMatriculas || 1)) * 100,
                  2
                );

                return (
                  <div
                    key={item.eixo}
                    onClick={() => onSelectEixo(item.eixo)}
                    className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectEixo(item.eixo)}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: item.cor }}
                        />
                        <span className="font-semibold text-slate-800 group-hover:text-[#005CAA] transition-colors">
                          {item.eixo}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          ({item.currentCoursesCount} {item.currentCoursesCount === 1 ? 'curso' : 'cursos'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="font-bold text-slate-900">
                          {item.currentMatriculas.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-slate-600 text-[11px] w-12 text-right">
                          {item.currentPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: item.cor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Classificação alinhada à 4ª Edição do CNCT (MEC)</span>
            <span className="font-medium text-[#005CAA]">Ver detalhes →</span>
          </div>
        </div>

        {/* Chart 2: Top Cursos por Matrículas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002855]">
                    Cursos com Maior Volume de Matrículas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detalhamento dos DRs ofertantes e volume total
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {topCourses.map((c) => {
                const barWidth = Math.max((c.totalMatriculas / maxCourseMat) * 100, 3);

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCourse(c)}
                    className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectCourse(c)}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-semibold text-slate-800 group-hover:text-[#005CAA] transition-colors truncate">
                          {c.curso}
                        </span>
                        <span className="text-[11px] text-slate-600 shrink-0 font-mono">
                          [{c.drRaw}]
                        </span>
                      </div>
                      <div className="font-mono tabular-nums font-bold text-[#002855] text-xs shrink-0">
                        {c.totalMatriculas.toLocaleString('pt-BR')}
                      </div>
                    </div>

                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      {c.ofertas.map((of, idx) => {
                        const ofWidth = (of.matriculas / c.totalMatriculas) * barWidth;
                        const colors = ['#005CAA', '#007A78', '#7C3AED', '#B45309'];
                        return (
                          <div
                            key={of.dr}
                            className="h-full transition-all duration-500 hover:opacity-80"
                            style={{
                              width: `${(of.matriculas / maxCourseMat) * 100}%`,
                              backgroundColor: colors[idx % colors.length],
                            }}
                            title={`${of.dr} (${of.drNome}): ${of.matriculas.toLocaleString('pt-BR')} matrículas`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Cores nas barras representam a divisão entre DRs parceiros</span>
            <span className="font-medium text-[#005CAA]">Explorar todos →</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: DRs & Macrorregiões */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DRs Ranking */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002855]">
                  Distribuição por Departamento Regional (DR)
                </h3>
                <p className="text-xs text-slate-500">
                  Ranking de matrículas nos DRs com cursos fora da base nacional
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {drBreakdown.map((dr) => {
              const width = Math.max((dr.currentMatriculas / maxDrMat) * 100, 2);

              return (
                <div
                  key={dr.sigla}
                  onClick={() => onSelectDr(dr.sigla)}
                  className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectDr(dr.sigla)}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#005CAA] w-6">
                        {dr.sigla}
                      </span>
                      <span className="font-medium text-slate-700 truncate max-w-[130px]">
                        {dr.nome}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        ({dr.regiao})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                      <span className="font-bold text-slate-900">
                        {dr.currentMatriculas.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-slate-600 text-[11px] w-10 text-right">
                        {dr.currentPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005CAA] rounded-full transition-all duration-500 group-hover:bg-[#002855]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Macrorregiões Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002855]">
                    Concentração Regional
                  </h3>
                  <p className="text-xs text-slate-500">
                    Participação por Macrorregião
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {REGIONS_AGGREGATES.map((reg) => {
                const regMat = courses
                  .flatMap((c) => c.ofertas)
                  .filter((of) => of.regiao === reg.regiao)
                  .reduce((sum, of) => sum + of.matriculas, 0);

                const regPct = filteredTotalMatriculas > 0
                  ? ((regMat / filteredTotalMatriculas) * 100).toFixed(1)
                  : '0';

                return (
                  <div
                    key={reg.regiao}
                    onClick={() => onSelectRegion(reg.regiao)}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">
                        Região {reg.regiao}
                      </span>
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {regMat.toLocaleString('pt-BR')} mat. ({regPct}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>DRs: {reg.drs.join(', ')}</span>
                      <span className="text-[#005CAA] font-medium">Filtrar</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block mb-0.5">
              Fato Relevante:
            </span>
            A Região Sudeste concentra a maior parte das matrículas devido ao grande volume de
            alunos em Minas Gerais (Desenho da Construção Civil) e São Paulo (Farmácia e Manufatura Digital).
          </div>
        </div>
      </div>
    </div>
  );
};
