import * as XLSX from 'xlsx';
import {
  COURSES_DATA,
  DRS_AGGREGATES,
  EIXO_AGGREGATES,
  FLATTENED_RECORDS,
  REGIONS_AGGREGATES,
  TOTAL_MATRICULAS,
} from '../data/coursesData';
import { FilterState, RawCourseData, FlattenedRecord } from '../types/data';

export function exportDashboardToExcel(
  filteredCourses: RawCourseData[],
  filteredRecords: FlattenedRecord[],
  activeFilters?: FilterState
) {
  const wb = XLSX.utils.book_new();

  // SHEET 1: Cursos Consolidados (Filtered if filters applied, or all)
  const sheet1Data: Record<string, unknown>[] = filteredCourses.map((c, idx) => ({
    'Nº': idx + 1,
    'Nome do Curso': c.curso,
    'Eixo Tecnológico (CNCT)': c.eixoTecnologico,
    'Departamentos Regionais (DRs)': c.drRaw,
    'Qtd. DRs': c.drsOfertantes.length,
    'Matrículas por DR (Original)': c.matriculasRaw,
    'Total de Matrículas': c.totalMatriculas,
    'Tipo de Oferta': c.isMultiDR ? 'Multi-DR (Compartilhada)' : 'DR Único (Isolada)',
    'Descrição Ocupacional': c.descricao || '',
  }));

  // Add total summary row
  const totalFiltroMatriculas = filteredCourses.reduce((sum, c) => sum + c.totalMatriculas, 0);
  sheet1Data.push({
    'Nº': (filteredCourses.length + 1) as unknown as number,
    'Nome do Curso': 'TOTAL GERAL SELECIONADO',
    'Eixo Tecnológico (CNCT)': '-',
    'Departamentos Regionais (DRs)': '-',
    'Qtd. DRs': '-' as unknown as number,
    'Matrículas por DR (Original)': '-',
    'Total de Matrículas': totalFiltroMatriculas,
    'Tipo de Oferta': '-',
    'Descrição Ocupacional': '',
  });

  const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
  ws1['!cols'] = [
    { wch: 6 },
    { wch: 34 },
    { wch: 30 },
    { wch: 24 },
    { wch: 10 },
    { wch: 26 },
    { wch: 18 },
    { wch: 26 },
    { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Cursos Consolidados');

  // SHEET 2: Desagregação Detalhada (DR x Curso)
  const sheet2Data = filteredRecords.map((r, idx) => {
    const pct = r.totalCursoMatriculas > 0
      ? ((r.matriculas / r.totalCursoMatriculas) * 100).toFixed(1) + '%'
      : '0%';
    const pctNacional = ((r.matriculas / TOTAL_MATRICULAS) * 100).toFixed(2) + '%';

    return {
      'Item': idx + 1,
      'DR': r.dr,
      'Estado': r.drNome,
      'Região': r.regiao,
      'Curso': r.curso,
      'Eixo Tecnológico (CNCT)': r.eixoTecnologico,
      'Matrículas no DR': r.matriculas,
      'Total do Curso': r.totalCursoMatriculas,
      '% do Curso no DR': pct,
      '% do Total Nacional': pctNacional,
      'Oferta Compartilhada?': r.isMultiDR ? 'Sim' : 'Não',
      'Outros DRs Parceiros': r.drsDoCurso.filter((d) => d !== r.dr).join(', ') || 'Nenhum (Exclusivo)',
    };
  });

  const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
  ws2['!cols'] = [
    { wch: 6 },
    { wch: 8 },
    { wch: 22 },
    { wch: 14 },
    { wch: 34 },
    { wch: 30 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 18 },
    { wch: 20 },
    { wch: 26 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Detalhamento DR x Curso');

  // SHEET 3: Sumário por DR (Departamento Regional)
  const sheet3Data = DRS_AGGREGATES.map((dr) => ({
    'Sigla': dr.sigla,
    'Departamento Regional': dr.nome,
    'Macrorregião': dr.regiao,
    'Capital': dr.capital,
    'Total de Matrículas': dr.totalMatriculas,
    '% Matrículas Nacional': dr.percentualNacional + '%',
    'Total de Cursos Ofertados': dr.totalCursos,
    'Cursos Ofertados': dr.cursos.map((c) => `${c.curso} (${c.matriculas})`).join('; '),
  }));

  const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
  ws3['!cols'] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 16 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 22 },
    { wch: 65 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Resumo por DR');

  // SHEET 4: Sumário por Região e Eixo Tecnológico
  const sheet4Data = EIXO_AGGREGATES.map((e) => ({
    'Eixo Tecnológico (CNCT)': e.eixo,
    'Total de Matrículas': e.totalMatriculas,
    '% do Total Nacional': e.percentualNacional + '%',
    'Qtd. de Cursos': e.totalCursos,
    'DRs com Oferta': e.drsOfertantes.join(', '),
  }));

  const ws4 = XLSX.utils.json_to_sheet(sheet4Data);
  ws4['!cols'] = [
    { wch: 32 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, ws4, 'Eixos Tecnológicos');

  // SHEET 5: Metadados, Metodologia e Créditos Oficiais
  const dataHora = new Date().toLocaleString('pt-BR');
  const metadataRows = [
    { Informação: 'Sistema', Detalhe: 'SENAI - Painel de Matrículas Fora da Base Nacional' },
    { Informação: 'Créditos Oficiais', Detalhe: 'Equipe de Itinerários Nacionais do SENAI' },
    { Informação: 'Entidade Mantenedora', Detalhe: 'SENAI - Departamento Nacional (Serviço Nacional de Aprendizagem Industrial)' },
    { Informação: 'Data/Hora de Geração', Detalhe: dataHora },
    { Informação: 'Total de Matrículas Mapeadas', Detalhe: `${TOTAL_MATRICULAS.toLocaleString('pt-BR')} matrículas` },
    { Informação: 'Total de Cursos', Detalhe: `${COURSES_DATA.length} cursos técnicos` },
    { Informação: 'Total de DRs Envolvidos', Detalhe: '10 Departamentos Regionais (MG, PR, SP, SC, MS, MA, ES, RN, BA, RO)' },
    { Informação: 'Macrorregiões Envolvidas', Detalhe: '5 Regiões (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)' },
    { Informação: 'Referência Pedagógica', Detalhe: 'Catálogo Nacional de Cursos Técnicos (CNCT - 4ª Edição / MEC)' },
    {
      Informação: 'Filtros Ativos na Exportação',
      Detalhe: activeFilters
        ? `Busca: "${activeFilters.search || 'Nenhuma'}" | Eixo: ${activeFilters.eixo} | Região: ${activeFilters.regiao} | DR: ${activeFilters.dr} | Oferta: ${activeFilters.tipoOferta}`
        : 'Todos os registros exportados',
    },
    {
      Informação: 'Observações Metodológicas',
      Detalhe:
        'Cursos técnicos ofertados regionalmente pelos DRs que atendem a vocações industriais locais ou demandas emergentes e que não constam no banco consolidado da base nacional do SENAI.',
    },
  ];

  const ws5 = XLSX.utils.json_to_sheet(metadataRows);
  ws5['!cols'] = [{ wch: 28 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, ws5, 'Metadados e Créditos');

  // Write and download
  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `SENAI_Matriculas_Cursos_Fora_Base_Nacional_${dateStamp}.xlsx`);
}
