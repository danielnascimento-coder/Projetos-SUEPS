import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  ExternalLink,
  Layers,
  Share2,
  Users,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { EIXOS_TECNOLOGICOS, TOTAL_MATRICULAS } from '../data/coursesData';
import { RawCourseData } from '../types/data';

interface CourseListProps {
  courses: RawCourseData[];
  selectedCourse: RawCourseData | null;
  setSelectedCourse: (course: RawCourseData | null) => void;
  onFilterByDr: (dr: string) => void;
  onFilterByEixo: (eixo: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourse,
  setSelectedCourse,
  onFilterByDr,
  onFilterByEixo,
}) => {
  const getEixoConfig = (eixoNome: string) => {
    return (
      EIXOS_TECNOLOGICOS.find((e) => e.nome === eixoNome) || {
        cor: '#005CAA',
        corBg: '#E8F1F9',
        corBorda: '#B0D3F0',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#002855]">
            Catálogo de Cursos Técnicos Mapeados
          </h2>
          <p className="text-xs text-slate-500">
            {courses.length} cursos identificados fora da base nacional do SENAI
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Clique no card para abrir o detalhamento pedagógico e distribuição por DR
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhum curso encontrado com os filtros atuais
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tente redefinir a busca textual ou os filtros de Eixo Tecnológico,
            Região e DR para visualizar os cursos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const eixoConfig = getEixoConfig(course.eixoTecnologico);
            const pctNacional = (
              (course.totalMatriculas / TOTAL_MATRICULAS) *
              100
            ).toFixed(1);

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group bg-white border border-slate-200 hover:border-[#005CAA] rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top metadata line */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <span
                        className="w-2 h-2 rounded-xs shrink-0"
                        style={{ backgroundColor: eixoConfig.cor }}
                      />
                      <span className="truncate font-medium text-slate-700">
                        {course.eixoTecnologico}
                      </span>
                    </div>

                    {course.isMultiDR ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                        <Share2 className="w-3 h-3" />
                        {course.drsOfertantes.length} DRs
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 shrink-0 font-medium">
                        DR Único
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005CAA] transition-colors leading-snug">
                    {course.curso}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.descricao}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {/* DR Offerings Breakdown */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">
                      DRs Ofertantes:
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {course.drRaw}
                    </span>
                  </div>

                  {/* Multi-segment progress bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex mb-2.5">
                    {course.ofertas.map((of, idx) => {
                      const colors = [
                        '#005CAA',
                        '#007A78',
                        '#7C3AED',
                        '#B45309',
                        '#15803D',
                      ];
                      const width = (of.matriculas / course.totalMatriculas) * 100;
                      return (
                        <div
                          key={of.dr}
                          className="h-full"
                          style={{
                            width: `${width}%`,
                            backgroundColor: colors[idx % colors.length],
                          }}
                          title={`${of.dr}: ${of.matriculas} matrículas (${width.toFixed(1)}%)`}
                        />
                      );
                    })}
                  </div>

                  {/* Matriculas footer */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-600">
                      {pctNacional}% do total nacional
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-mono font-extrabold text-[#002855] tabular-nums">
                        {course.totalMatriculas.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs text-slate-500">matrículas</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#002855] text-white p-6 flex items-start justify-between">
              <div>
                <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold block mb-1">
                  Eixo Tecnológico: {selectedCourse.eixoTecnologico}
                </span>
                <h3 className="text-xl font-bold tracking-tight">
                  {selectedCourse.curso}
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  {selectedCourse.drsOfertantes.length > 1
                    ? `Oferta Compartilhada entre ${selectedCourse.drsOfertantes.length} Departamentos Regionais`
                    : `Oferta Exclusiva pelo DR/${selectedCourse.drRaw}`}
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="text-blue-200 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Total Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                  <span className="text-xs text-slate-500 block">Total de Alunos</span>
                  <span className="text-2xl font-bold font-mono text-[#005CAA] tabular-nums">
                    {selectedCourse.totalMatriculas.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 block">DRs Ofertantes</span>
                  <span className="text-2xl font-bold font-mono text-slate-800 tabular-nums">
                    {selectedCourse.drsOfertantes.length}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 block">% Nacional</span>
                  <span className="text-2xl font-bold font-mono text-slate-800 tabular-nums">
                    {(
                      (selectedCourse.totalMatriculas / TOTAL_MATRICULAS) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Perfil e Descrição do Curso
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {selectedCourse.descricao}
                </p>
              </div>

              {/* Offerings breakdown table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Matrículas por Departamento Regional (DR)
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">DR</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3">Região</th>
                        <th className="py-2.5 px-3 text-right">Matrículas</th>
                        <th className="py-2.5 px-3 text-right">% do Curso</th>
                        <th className="py-2.5 px-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedCourse.ofertas.map((of) => {
                        const pctCourse = (
                          (of.matriculas / selectedCourse.totalMatriculas) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={of.dr} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-bold text-[#005CAA]">
                              {of.dr}
                            </td>
                            <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                              {of.drNome}
                            </td>
                            <td className="py-2.5 px-3 font-sans text-slate-500">
                              {of.regiao}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                              {of.matriculas.toLocaleString('pt-BR')}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">
                              {pctCourse}%
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => {
                                  onFilterByDr(of.dr);
                                  setSelectedCourse(null);
                                }}
                                className="font-sans text-[11px] font-semibold text-[#005CAA] hover:underline"
                              >
                                Filtrar DR
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  onFilterByEixo(selectedCourse.eixoTecnologico);
                  setSelectedCourse(null);
                }}
                className="text-xs font-semibold text-[#005CAA] hover:underline"
              >
                Ver todos de {selectedCourse.eixoTecnologico}
              </button>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#005CAA] hover:bg-[#004587] rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
