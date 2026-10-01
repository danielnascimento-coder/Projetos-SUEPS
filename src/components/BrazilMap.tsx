import React, { useState } from 'react';
import { Building2, CheckCircle2, MapPin, Navigation, Users, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  DEPARTAMENTOS_REGIONAIS,
  DRS_AGGREGATES,
  TOTAL_MATRICULAS,
} from '../data/coursesData';
import {
  BRAZIL_MAP_VIEWBOX,
  BRAZIL_STATES_GEO,
  BrazilStateGeo,
} from '../data/brazilGeoPaths';
import { RawCourseData } from '../types/data';

interface BrazilMapProps {
  courses: RawCourseData[];
  selectedDr: string;
  onSelectDr: (dr: string) => void;
}

export const BrazilMap: React.FC<BrazilMapProps> = ({
  courses,
  selectedDr,
  onSelectDr,
}) => {
  const [hoveredStateSigla, setHoveredStateSigla] = useState<string | null>(null);

  // Compute live statistics for each DR based on current courses
  const drStats: Record<
    string,
    { matriculas: number; cursosCount: number; cursosNomes: string[] }
  > = {};

  Object.keys(DEPARTAMENTOS_REGIONAIS).forEach((dr) => {
    drStats[dr] = { matriculas: 0, cursosCount: 0, cursosNomes: [] };
  });

  courses.forEach((c) => {
    c.ofertas.forEach((of) => {
      if (!drStats[of.dr]) {
        drStats[of.dr] = { matriculas: 0, cursosCount: 0, cursosNomes: [] };
      }
      drStats[of.dr].matriculas += of.matriculas;
      drStats[of.dr].cursosCount += 1;
      drStats[of.dr].cursosNomes.push(`${c.curso} (${of.matriculas})`);
    });
  });

  const activeHoveredState = hoveredStateSigla
    ? BRAZIL_STATES_GEO.find((s) => s.sigla === hoveredStateSigla)
    : null;

  const activeSelectedState = selectedDr !== 'all'
    ? BRAZIL_STATES_GEO.find((s) => s.sigla === selectedDr)
    : null;

  const currentFocusState = activeHoveredState || activeSelectedState;
  const currentFocusStat = currentFocusState ? drStats[currentFocusState.sigla] : null;

  // Determine fill color for each state
  const getStateFill = (sigla: string) => {
    const isSelected = selectedDr === sigla;
    const isHovered = hoveredStateSigla === sigla;
    const isParticipating = !!DEPARTAMENTOS_REGIONAIS[sigla];
    const stat = drStats[sigla];

    if (!isParticipating) {
      return isHovered ? '#CBD5E1' : '#E2E8F0'; // Non-participating neutral state
    }

    const mat = stat?.matriculas || 0;

    if (isSelected) {
      return '#002855'; // Dark SENAI Navy when selected
    }

    if (mat >= 1000) {
      return isHovered ? '#003366' : '#004587'; // Minas Gerais high volume
    } else if (mat >= 200) {
      return isHovered ? '#004C8C' : '#005CAA'; // PR, SP, SC
    } else if (mat >= 50) {
      return isHovered ? '#0070B8' : '#0284C7'; // MS, MA, ES, RN, BA
    } else if (mat > 0) {
      return isHovered ? '#0284C7' : '#38BDF8'; // RO (<50)
    }

    return '#BAE6FD';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#005CAA] rounded-md">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#002855]">
              Mapa Geográfico dos Departamentos Regionais (DRs)
            </h3>
            <p className="text-xs text-slate-500">
              Contorno geográfico oficial dos 27 estados com destaque para os 10 DRs participantes
            </p>
          </div>
        </div>

        {selectedDr !== 'all' && (
          <button
            onClick={() => onSelectDr('all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005CAA] hover:text-[#002855] px-2.5 py-1 rounded-md hover:bg-blue-50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar seleção de estado</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Geographic Map of Brazil */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-50/70 rounded-xl border border-slate-100 relative">
          <svg
            viewBox={BRAZIL_MAP_VIEWBOX}
            className="w-full max-w-[480px] h-auto select-none drop-shadow-xs"
            aria-label="Mapa Geográfico do Brasil com Departamentos Regionais do SENAI"
          >
            <defs>
              <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Render all 27 Brazilian State paths */}
            <g filter="url(#map-shadow)">
              {BRAZIL_STATES_GEO.map((state) => {
                const isParticipating = !!DEPARTAMENTOS_REGIONAIS[state.sigla];
                const isSelected = selectedDr === state.sigla;
                const isHovered = hoveredStateSigla === state.sigla;
                const fill = getStateFill(state.sigla);
                const strokeColor = isSelected ? '#F59E0B' : '#FFFFFF';
                const strokeWidth = isSelected ? 1.8 : isHovered ? 1.2 : 0.6;

                return (
                  <path
                    key={state.sigla}
                    id={`geo-${state.sigla}`}
                    d={state.path}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-colors duration-150 ${
                      isParticipating
                        ? 'cursor-pointer hover:opacity-95'
                        : 'cursor-default opacity-85 hover:opacity-100'
                    }`}
                    onClick={() => {
                      if (isParticipating) {
                        onSelectDr(selectedDr === state.sigla ? 'all' : state.sigla);
                      }
                    }}
                    onMouseEnter={() => setHoveredStateSigla(state.sigla)}
                    onMouseLeave={() => setHoveredStateSigla(null)}
                  >
                    <title>
                      {state.nome} ({state.sigla}) - Região {state.regiao}
                      {isParticipating
                        ? ` • ${drStats[state.sigla]?.matriculas || 0} matrículas`
                        : ' (Sem oferta mapeada)'}
                    </title>
                  </path>
                );
              })}
            </g>

            {/* Labels for Participating DRs */}
            <g className="pointer-events-none">
              {BRAZIL_STATES_GEO.filter(
                (s) => !!DEPARTAMENTOS_REGIONAIS[s.sigla]
              ).map((state) => {
                const isSelected = selectedDr === state.sigla;
                const stat = drStats[state.sigla];
                const hasMatriculas = stat && stat.matriculas > 0;
                const textColor = hasMatriculas && (stat.matriculas >= 200 || isSelected)
                  ? '#FFFFFF'
                  : '#002855';

                return (
                  <g key={`label-${state.sigla}`}>
                    {/* Small badge shadow behind text */}
                    <circle
                      cx={state.labelX}
                      cy={state.labelY}
                      r={state.sigla === 'DF' ? 4 : 5.5}
                      fill={isSelected ? '#F59E0B' : hasMatriculas ? '#002855' : '#94A3B8'}
                      opacity={0.35}
                    />
                    <text
                      x={state.labelX}
                      y={state.labelY + 2.5}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={state.sigla === 'DF' ? '5.5' : '6.5'}
                      fontWeight="800"
                      fontFamily="JetBrains Mono, monospace"
                      className="select-none"
                    >
                      {state.sigla}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Interactive Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#004587] border border-[#002855]" />
              <span className="font-medium">&gt; 1.000 mat. (MG)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#005CAA] border border-[#004587]" />
              <span className="font-medium">200 - 1.000 (PR, SP, SC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#0284C7] border border-[#005CAA]" />
              <span className="font-medium">50 - 200 (MS, MA, ES, RN, BA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#38BDF8] border border-[#0284C7]" />
              <span className="font-medium">&lt; 50 (RO)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#E2E8F0] border border-slate-300" />
              <span>Demais Estados</span>
            </div>
          </div>
        </div>

        {/* State Detail Panel */}
        <div className="lg:col-span-5 space-y-4">
          {currentFocusState ? (
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono text-[#005CAA]">
                      {currentFocusState.sigla}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-[#004587] font-semibold rounded-md">
                      Região {currentFocusState.regiao}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {currentFocusState.nome}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Capital: {currentFocusState.capital}
                  </p>
                </div>

                {DEPARTAMENTOS_REGIONAIS[currentFocusState.sigla] && (
                  <button
                    onClick={() =>
                      onSelectDr(
                        selectedDr === currentFocusState.sigla
                          ? 'all'
                          : currentFocusState.sigla
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedDr === currentFocusState.sigla
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-[#005CAA] text-white hover:bg-[#004587]'
                    }`}
                  >
                    {selectedDr === currentFocusState.sigla
                      ? 'Filtro Ativo'
                      : 'Filtrar DR'}
                  </button>
                )}
              </div>

              {DEPARTAMENTOS_REGIONAIS[currentFocusState.sigla] && currentFocusStat ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-100">
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-[11px] text-slate-500 block">
                        Matrículas no DR
                      </span>
                      <span className="text-lg font-bold font-mono text-[#002855] tabular-nums">
                        {currentFocusStat.matriculas.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {TOTAL_MATRICULAS > 0
                          ? (
                              (currentFocusStat.matriculas / TOTAL_MATRICULAS) *
                              100
                            ).toFixed(1)
                          : '0'}
                        % do Brasil
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-[11px] text-slate-500 block">
                        Cursos Ofertados
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-800 tabular-nums">
                        {currentFocusStat.cursosCount}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        fora da base nacional
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Cursos ofertados neste Regional:
                    </span>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                      {currentFocusStat.cursosNomes.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-2 bg-white rounded-md border border-slate-200 text-slate-700 font-medium flex items-center justify-between"
                        >
                          <span className="truncate pr-2">{item.split('(')[0]}</span>
                          <span className="font-mono text-[#005CAA] font-bold shrink-0">
                            {item.match(/\((.*?)\)/)?.[1] || ''} mat.
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 pt-3 border-t border-blue-100 text-xs text-slate-600 bg-white p-3 rounded-lg border border-blue-100">
                  <span className="font-semibold block text-slate-800">
                    Sem cursos fora da base nacional
                  </span>
                  Este Departamento Regional não possui registros de cursos técnicos ofertados
                  fora da base nacional na amostragem atual.
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-3">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Explore o Mapa do Brasil
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Passe o mouse sobre qualquer um dos 27 estados no mapa para ver detalhes.
                  Clique em um dos 10 DRs coloridos para aplicar o filtro.
                </p>
              </div>

              {/* Fast Selector Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                  Atalhos rápidos para os 10 DRs ofertantes:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {Object.keys(DEPARTAMENTOS_REGIONAIS).map((sigla) => {
                    const isSelected = selectedDr === sigla;
                    return (
                      <button
                        key={sigla}
                        onClick={() =>
                          onSelectDr(isSelected ? 'all' : sigla)
                        }
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#005CAA] text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-[#005CAA] hover:text-[#005CAA]'
                        }`}
                      >
                        {sigla}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
