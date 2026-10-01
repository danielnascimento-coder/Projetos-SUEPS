import React, { useState, useMemo } from 'react';
import {
  COURSES_DATA,
  FLATTENED_RECORDS,
  TOTAL_CURSOS,
  TOTAL_DRS,
  TOTAL_MATRICULAS,
  TOTAL_REGIOES,
} from './data/coursesData';
import { FilterState, RawCourseData, FlattenedRecord } from './types/data';
import { Header, ActiveTab } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { OverviewCharts } from './components/OverviewCharts';
import { DrAnalysis } from './components/DrAnalysis';
import { CourseList } from './components/CourseList';
import { BrazilMap } from './components/BrazilMap';
import { DataTable } from './components/DataTable';
import { CreditsModal } from './components/CreditsModal';
import { exportDashboardToExcel } from './utils/exportXlsx';
import {
  Award,
  CheckCircle,
  FileSpreadsheet,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<RawCourseData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    eixo: 'all',
    regiao: 'all',
    dr: 'all',
    tipoOferta: 'all',
    faixaMatricula: 'all',
  });

  // Filter courses
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = course.curso.toLowerCase().includes(q);
        const matchesDr = course.drRaw.toLowerCase().includes(q);
        const matchesEixo = course.eixoTecnologico.toLowerCase().includes(q);
        if (!matchesName && !matchesDr && !matchesEixo) return false;
      }

      // Eixo
      if (filters.eixo !== 'all' && course.eixoTecnologico !== filters.eixo) {
        return false;
      }

      // DR
      if (filters.dr !== 'all' && !course.drsOfertantes.includes(filters.dr)) {
        return false;
      }

      // Region (course must have at least one offering in that region)
      if (filters.regiao !== 'all') {
        const hasRegion = course.ofertas.some((of) => of.regiao === filters.regiao);
        if (!hasRegion) return false;
      }

      // Tipo de oferta
      if (filters.tipoOferta === 'multi' && !course.isMultiDR) return false;
      if (filters.tipoOferta === 'single' && course.isMultiDR) return false;

      // Faixa de matrícula
      if (filters.faixaMatricula === 'high' && course.totalMatriculas < 500) return false;
      if (
        filters.faixaMatricula === 'medium' &&
        (course.totalMatriculas < 50 || course.totalMatriculas >= 500)
      )
        return false;
      if (filters.faixaMatricula === 'niche' && course.totalMatriculas >= 50) return false;

      return true;
    });
  }, [filters]);

  // Filter flattened records
  const filteredRecords = useMemo(() => {
    return FLATTENED_RECORDS.filter((rec) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = rec.curso.toLowerCase().includes(q);
        const matchesDr = rec.dr.toLowerCase().includes(q);
        const matchesDrNome = rec.drNome.toLowerCase().includes(q);
        const matchesEixo = rec.eixoTecnologico.toLowerCase().includes(q);
        if (!matchesName && !matchesDr && !matchesDrNome && !matchesEixo) return false;
      }

      // Eixo
      if (filters.eixo !== 'all' && rec.eixoTecnologico !== filters.eixo) return false;

      // DR
      if (filters.dr !== 'all' && rec.dr !== filters.dr) return false;

      // Região
      if (filters.regiao !== 'all' && rec.regiao !== filters.regiao) return false;

      // Tipo oferta
      if (filters.tipoOferta === 'multi' && !rec.isMultiDR) return false;
      if (filters.tipoOferta === 'single' && rec.isMultiDR) return false;

      // Faixa matrícula
      if (filters.faixaMatricula === 'high' && rec.matriculas < 500) return false;
      if (
        filters.faixaMatricula === 'medium' &&
        (rec.matriculas < 50 || rec.matriculas >= 500)
      )
        return false;
      if (filters.faixaMatricula === 'niche' && rec.matriculas >= 50) return false;

      return true;
    });
  }, [filters]);

  // Computed metrics
  const totalFilteredMatriculas = useMemo(() => {
    return filteredCourses.reduce((sum, c) => sum + c.totalMatriculas, 0);
  }, [filteredCourses]);

  const distinctDrsCount = useMemo(() => {
    const drs = new Set(filteredCourses.flatMap((c) => c.drsOfertantes));
    return drs.size;
  }, [filteredCourses]);

  const distinctRegionsCount = useMemo(() => {
    const regions = new Set(
      filteredCourses.flatMap((c) => c.ofertas.map((of) => of.regiao))
    );
    return regions.size;
  }, [filteredCourses]);

  // Export handler
  const handleExport = () => {
    try {
      setIsExporting(true);
      exportDashboardToExcel(filteredCourses, filteredRecords, filters);
      setExportSuccessMessage(
        'Arquivo Excel (.xlsx) gerado e baixado com sucesso com metadados e créditos!'
      );
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Erro na exportação:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper filter setters for click-throughs from charts
  const handleSelectEixo = (eixo: string) => {
    setFilters((prev) => ({
      ...prev,
      eixo: prev.eixo === eixo ? 'all' : eixo,
    }));
  };

  const handleSelectDr = (dr: string) => {
    setFilters((prev) => ({
      ...prev,
      dr: prev.dr === dr ? 'all' : dr,
    }));
  };

  const handleSelectRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regiao: prev.regiao === region ? 'all' : region,
    }));
  };

  const handleSelectCourseByName = (courseName: string) => {
    const found = COURSES_DATA.find((c) => c.curso === courseName);
    if (found) {
      setSelectedCourse(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Header complying with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCredits={() => setIsCreditsOpen(true)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Editorial Title & Attribution Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#005CAA] uppercase tracking-wider mb-1">
              <span>SENAI · Departamento Nacional</span>
              <span aria-hidden="true">·</span>
              <span>Educação Profissional e Tecnológica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002855] tracking-tight">
              Matrículas dos DRs Fora da Base Nacional
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Painel analítico para monitoramento de 21 cursos técnicos ofertados regionalmente
              pelos Departamentos Regionais (DRs) que não integram o catálogo da Base Nacional do
              SENAI, categorizados por eixo tecnológico (CNCT) e macrorregião.
            </p>
          </div>

          {/* Attribution badge adhering to zero-pill rules */}
          <div className="shrink-0 flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <Award className="w-4 h-4 text-[#005CAA] shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">
                Créditos do Levantamento:
              </span>
              <span className="text-slate-600">
                Equipe de Itinerários Nacionais do SENAI
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert if exported */}
        {exportSuccessMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}

        {/* Unified Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          totalMatchesCourses={filteredCourses.length}
          totalMatchesMatriculas={totalFilteredMatriculas}
        />

        {/* KPI Cards */}
        <KpiCards
          currentMatriculas={totalFilteredMatriculas}
          currentCoursesCount={filteredCourses.length}
          currentDrsCount={distinctDrsCount}
          currentRegionsCount={distinctRegionsCount}
        />

        {/* Tab View Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <OverviewCharts
              courses={filteredCourses}
              onSelectEixo={handleSelectEixo}
              onSelectDr={handleSelectDr}
              onSelectRegion={handleSelectRegion}
              onSelectCourse={setSelectedCourse}
            />

            {/* Quick Map preview inside overview */}
            <div className="mt-8">
              <BrazilMap
                courses={filteredCourses}
                selectedDr={filters.dr}
                onSelectDr={handleSelectDr}
              />
            </div>

            {/* Quick table preview */}
            <div className="mt-8">
              <DataTable
                courses={filteredCourses}
                records={filteredRecords}
                onExport={handleExport}
                onSelectCourse={setSelectedCourse}
                onSelectDr={handleSelectDr}
              />
            </div>
          </div>
        )}

        {activeTab === 'drs' && (
          <DrAnalysis
            onSelectDr={handleSelectDr}
            onSelectCourse={handleSelectCourseByName}
            selectedDr={filters.dr}
          />
        )}

        {activeTab === 'courses' && (
          <CourseList
            courses={filteredCourses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            onFilterByDr={handleSelectDr}
            onFilterByEixo={handleSelectEixo}
          />
        )}

        {activeTab === 'map' && (
          <BrazilMap
            courses={filteredCourses}
            selectedDr={filters.dr}
            onSelectDr={handleSelectDr}
          />
        )}

        {activeTab === 'table' && (
          <DataTable
            courses={filteredCourses}
            records={filteredRecords}
            onExport={handleExport}
            onSelectCourse={setSelectedCourse}
            onSelectDr={handleSelectDr}
          />
        )}
      </main>

      {/* Footer with Mandatory Credits */}
      <footer className="bg-[#002855] text-white border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005CAA] flex items-center justify-center font-black text-lg text-white">
                SENAI
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">
                  Serviço Nacional de Aprendizagem Industrial
                </p>
                <p className="text-xs text-blue-200">
                  Departamento Nacional · Gerência de Educação Profissional e Tecnológica
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs font-semibold text-blue-100 flex items-center justify-center md:justify-end gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  Créditos: <strong>Equipe de Itinerários Nacionais do SENAI</strong>
                </span>
              </p>
              <p className="text-[11px] text-blue-300 mt-1">
                Classificação conforme Catálogo Nacional de Cursos Técnicos (CNCT/MEC - 4ª Edição).
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-3">
            <span>
              © {new Date().getFullYear()} SENAI Nacional. Painel de monitoramento e inteligência formativa.
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreditsOpen(true)}
                className="hover:text-white transition-colors underline"
              >
                Ficha Técnica e Metodologia
              </button>
              <button
                onClick={handleExport}
                className="hover:text-white transition-colors underline"
              >
                Exportar Planilha Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Credits and Methodology Modal */}
      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}
