import {
  CourseOffering,
  FlattenedRecord,
  RawCourseData,
  RegionalDepartment,
  RegionName,
  TechnologicalAxis,
} from '../types/data';

export const DEPARTAMENTOS_REGIONAIS: Record<string, RegionalDepartment> = {
  MA: { sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste', capital: 'São Luís' },
  ES: { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste', capital: 'Vitória' },
  SP: { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste', capital: 'São Paulo' },
  PR: { sigla: 'PR', nome: 'Paraná', regiao: 'Sul', capital: 'Curitiba' },
  MG: { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', capital: 'Belo Horizonte' },
  SC: { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul', capital: 'Florianópolis' },
  BA: { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste', capital: 'Salvador' },
  RN: { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', capital: 'Natal' },
  MS: { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', capital: 'Campo Grande' },
  RO: { sigla: 'RO', nome: 'Rondônia', regiao: 'Norte', capital: 'Porto Velho' },
};

export const REGIOES_BRASIL: RegionName[] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
];

export const EIXOS_TECNOLOGICOS: {
  nome: TechnologicalAxis;
  cor: string;
  corBg: string;
  corBorda: string;
  descricao: string;
}[] = [
  {
    nome: 'Infraestrutura',
    cor: '#005CAA', // SENAI Blue
    corBg: '#E8F1F9',
    corBorda: '#B0D3F0',
    descricao: 'Construção civil, transporte, portos, estradas e agrimensura.',
  },
  {
    nome: 'Gestão e Negócios',
    cor: '#007A78', // Teal acessível
    corBg: '#E6F6F5',
    corBorda: '#9EE0DC',
    descricao: 'Finanças, cooperativismo, marketing, contabilidade e imobiliário.',
  },
  {
    nome: 'Produção Cultural e Design',
    cor: '#7C3AED', // Violeta acessível
    corBg: '#F3E8FF',
    corBorda: '#D8B4FE',
    descricao: 'Design de interiores, moda, artes visuais e estilismo.',
  },
  {
    nome: 'Controle e Processos Industriais',
    cor: '#B45309', // Âmbar industrial acessível
    corBg: '#FEF3C7',
    corBorda: '#FCD34D',
    descricao: 'Manufatura digital, usinagem e ferramentaria.',
  },
  {
    nome: 'Ambiente e Saúde',
    cor: '#15803D', // Verde floresta acessível
    corBg: '#DCFCE7',
    corBorda: '#86EFAC',
    descricao: 'Farmácia, prevenção contra incêndio e segurança.',
  },
  {
    nome: 'Recursos Naturais',
    cor: '#0F766E', // Verde petróleo acessível
    corBg: '#CCFBF1',
    corBorda: '#5EEAD4',
    descricao: 'Florestas, geologia, mineração e hidrologia.',
  },
];

interface RawRowInput {
  drRaw: string;
  curso: string;
  matriculasRaw: string;
  eixoTecnologico: TechnologicalAxis;
  descricao: string;
}

const RAW_TABLE_DATA: RawRowInput[] = [
  {
    drRaw: 'MA/ES/SP/PR',
    curso: 'PORTOS',
    matriculasRaw: '92/71/70/15',
    eixoTecnologico: 'Infraestrutura',
    descricao: 'Operações portuárias, logística marítima, gestão de cargas e movimentação de contêineres.',
  },
  {
    drRaw: 'MG/SC',
    curso: 'DESENHO DA CONSTRUÇÃO CIVIL',
    matriculasRaw: '6650/124',
    eixoTecnologico: 'Infraestrutura',
    descricao: 'Modelagem técnica, projetos arquitetônicos, detalhamento estrutural e ferramentas BIM.',
  },
  {
    drRaw: 'BA/RN',
    curso: 'MARKETING',
    matriculasRaw: '60/5',
    eixoTecnologico: 'Gestão e Negócios',
    descricao: 'Estratégia comercial industrial, pesquisa de mercado, branding e comunicação integrada.',
  },
  {
    drRaw: 'MG/RN',
    curso: 'DESIGN DE MODA',
    matriculasRaw: '425/66',
    eixoTecnologico: 'Produção Cultural e Design',
    descricao: 'Criação têxtil, modelagem industrial, fichas técnicas e tendências de vestuário.',
  },
  {
    drRaw: 'MG/SC',
    curso: 'FERRAMENTARIA',
    matriculasRaw: '189/28',
    eixoTecnologico: 'Controle e Processos Industriais',
    descricao: 'Usinagem de precisão, moldes de injeção, estampos e dispositivos industriais.',
  },
  {
    drRaw: 'PR',
    curso: 'COOPERATIVISMO',
    matriculasRaw: '660',
    eixoTecnologico: 'Gestão e Negócios',
    descricao: 'Gestão de cooperativas agroindustriais, governança, legislação e associativismo.',
  },
  {
    drRaw: 'SP',
    curso: 'FARMÁCIA',
    matriculasRaw: '355',
    eixoTecnologico: 'Ambiente e Saúde',
    descricao: 'Produção farmacêutica, controle de qualidade de medicamentos, boas práticas de fabricação.',
  },
  {
    drRaw: 'SP',
    curso: 'MANUFATURA DIGITAL',
    matriculasRaw: '252',
    eixoTecnologico: 'Controle e Processos Industriais',
    descricao: 'Indústria 4.0, digital twin, automação integrada, robótica e prototipagem aditiva.',
  },
  {
    drRaw: 'MG',
    curso: 'TÉCNICO EM AGRIMENSURA',
    matriculasRaw: '195',
    eixoTecnologico: 'Infraestrutura',
    descricao: 'Topografia, georreferenciamento de imóveis, levantamentos planialtimétricos e GNSS.',
  },
  {
    drRaw: 'MG',
    curso: 'DESIGN DE INTERIORES',
    matriculasRaw: '177',
    eixoTecnologico: 'Produção Cultural e Design',
    descricao: 'Planejamento de espaços corporativos e industriais, iluminação, ergonomia e mobiliário.',
  },
  {
    drRaw: 'MS',
    curso: 'FLORESTAS',
    matriculasRaw: '146',
    eixoTecnologico: 'Recursos Naturais',
    descricao: 'Silvicultura industrial, manejo florestal sustentável, celulose e papel e colheita mecanizada.',
  },
  {
    drRaw: 'MG',
    curso: 'ESTILISMOS E COORDENAÇÃO DE MODA',
    matriculasRaw: '83',
    eixoTecnologico: 'Produção Cultural e Design',
    descricao: 'Desenvolvimento de coleções, direção criativa de vestuário, consultoria de imagem fabril.',
  },
  {
    drRaw: 'MG',
    curso: 'TÉCNICO EM ARTES VISUAIS',
    matriculasRaw: '76',
    eixoTecnologico: 'Produção Cultural e Design',
    descricao: 'Ilustração digital, técnicas de animação, artes gráficas para materiais instrucionais.',
  },
  {
    drRaw: 'MG',
    curso: 'ESTRADAS',
    matriculasRaw: '50',
    eixoTecnologico: 'Infraestrutura',
    descricao: 'Pavimentação rodoviária, terraplenagem, traçado geométrico de vias e drenagem.',
  },
  {
    drRaw: 'MG',
    curso: 'GEOPROCESSAMENTO',
    matriculasRaw: '48',
    eixoTecnologico: 'Infraestrutura',
    descricao: 'Sistemas de Informação Geográfica (SIG), sensoriamento remoto e cartografia temática.',
  },
  {
    drRaw: 'MG',
    curso: 'HIDROLOGIA',
    matriculasRaw: '36',
    eixoTecnologico: 'Recursos Naturais',
    descricao: 'Monitoramento de bacias hidrográficas, medição de vazão hídrica e gestão de recursos hídricos.',
  },
  {
    drRaw: 'MG',
    curso: 'PREVENÇÃO E COMBATE A INCÊNDIO',
    matriculasRaw: '32',
    eixoTecnologico: 'Ambiente e Saúde',
    descricao: 'Sistemas de combate a chamas, brigadas industriais, rotas de fuga e normas de segurança.',
  },
  {
    drRaw: 'MG',
    curso: 'GEOLOGIA',
    matriculasRaw: '12',
    eixoTecnologico: 'Recursos Naturais',
    descricao: 'Prospecção mineral, mapeamento litológico, ensaios geotécnicos e perfuração de poços.',
  },
  {
    drRaw: 'PR',
    curso: 'FINANÇAS',
    matriculasRaw: '5',
    eixoTecnologico: 'Gestão e Negócios',
    descricao: 'Análise de custos industriais, controladoria, fluxo de caixa e planejamento orçamentário.',
  },
  {
    drRaw: 'MS',
    curso: 'CONTABILIDADE',
    matriculasRaw: '2',
    eixoTecnologico: 'Gestão e Negócios',
    descricao: 'Escrituração contábil, conformidade tributária e conciliação financeira empresarial.',
  },
  {
    drRaw: 'RO',
    curso: 'TRANSAÇÃO IMOBILIÁRIAS',
    matriculasRaw: '1',
    eixoTecnologico: 'Gestão e Negócios',
    descricao: 'Intermediação e regularização de imóveis, avaliação patrimonial e contratos imobiliários.',
  },
];

// Process raw data into structured models
export const COURSES_DATA: RawCourseData[] = RAW_TABLE_DATA.map((item, index) => {
  const drList = item.drRaw.split('/').map((s) => s.trim());
  const matList = item.matriculasRaw.split('/').map((s) => parseInt(s.trim(), 10));

  const ofertas: CourseOffering[] = drList.map((drSigla, i) => {
    const drInfo = DEPARTAMENTOS_REGIONAIS[drSigla] || {
      sigla: drSigla,
      nome: drSigla,
      regiao: 'Sudeste' as RegionName,
      capital: 'Capital',
    };
    return {
      dr: drSigla,
      drNome: drInfo.nome,
      regiao: drInfo.regiao,
      matriculas: isNaN(matList[i]) ? 0 : matList[i],
    };
  });

  const totalMatriculas = ofertas.reduce((acc, curr) => acc + curr.matriculas, 0);

  return {
    id: `course-${index + 1}`,
    drRaw: item.drRaw,
    curso: item.curso,
    matriculasRaw: item.matriculasRaw,
    eixoTecnologico: item.eixoTecnologico,
    descricao: item.descricao,
    ofertas,
    totalMatriculas,
    drsOfertantes: drList,
    isMultiDR: drList.length > 1,
  };
});

// Flattened data: one record per (DR x Course)
export const FLATTENED_RECORDS: FlattenedRecord[] = COURSES_DATA.flatMap((course) =>
  course.ofertas.map((of, ofIdx) => ({
    id: `${course.id}-dr-${of.dr}-${ofIdx}`,
    curso: course.curso,
    dr: of.dr,
    drNome: of.drNome,
    regiao: of.regiao,
    matriculas: of.matriculas,
    eixoTecnologico: course.eixoTecnologico,
    isMultiDR: course.isMultiDR,
    totalCursoMatriculas: course.totalMatriculas,
    drsDoCurso: course.drsOfertantes,
  }))
);

// Pre-computed totals
export const TOTAL_MATRICULAS = COURSES_DATA.reduce((acc, c) => acc + c.totalMatriculas, 0);
export const TOTAL_CURSOS = COURSES_DATA.length;
export const TOTAL_DRS = Object.keys(DEPARTAMENTOS_REGIONAIS).length;
export const TOTAL_REGIOES = REGIOES_BRASIL.length;

// Aggregation by DR
export interface DrAggregate {
  sigla: string;
  nome: string;
  regiao: RegionName;
  capital: string;
  totalMatriculas: number;
  percentualNacional: number;
  totalCursos: number;
  cursos: {
    curso: string;
    matriculas: number;
    eixoTecnologico: TechnologicalAxis;
    isMultiDR: boolean;
  }[];
}

export const DRS_AGGREGATES: DrAggregate[] = Object.values(DEPARTAMENTOS_REGIONAIS).map(
  (dr) => {
    const drCourses = FLATTENED_RECORDS.filter((r) => r.dr === dr.sigla);
    const totalMat = drCourses.reduce((sum, r) => sum + r.matriculas, 0);
    return {
      sigla: dr.sigla,
      nome: dr.nome,
      regiao: dr.regiao,
      capital: dr.capital,
      totalMatriculas: totalMat,
      percentualNacional: Number(((totalMat / TOTAL_MATRICULAS) * 100).toFixed(2)),
      totalCursos: drCourses.length,
      cursos: drCourses
        .map((c) => ({
          curso: c.curso,
          matriculas: c.matriculas,
          eixoTecnologico: c.eixoTecnologico,
          isMultiDR: c.isMultiDR,
        }))
        .sort((a, b) => b.matriculas - a.matriculas),
    };
  }
).sort((a, b) => b.totalMatriculas - a.totalMatriculas);

// Aggregation by Region
export interface RegionAggregate {
  regiao: RegionName;
  totalMatriculas: number;
  percentualNacional: number;
  drs: string[];
  totalCursos: number;
}

export const REGIONS_AGGREGATES: RegionAggregate[] = REGIOES_BRASIL.map((reg) => {
  const regDrs = DRS_AGGREGATES.filter((d) => d.regiao === reg);
  const totalMat = regDrs.reduce((acc, d) => acc + d.totalMatriculas, 0);
  const drSiglas = regDrs.map((d) => d.sigla);
  const distinctCourses = new Set(
    FLATTENED_RECORDS.filter((r) => r.regiao === reg).map((r) => r.curso)
  );

  return {
    regiao: reg,
    totalMatriculas: totalMat,
    percentualNacional: Number(((totalMat / TOTAL_MATRICULAS) * 100).toFixed(2)),
    drs: drSiglas,
    totalCursos: distinctCourses.size,
  };
}).sort((a, b) => b.totalMatriculas - a.totalMatriculas);

// Aggregation by Eixo Tecnológico
export interface EixoAggregate {
  eixo: TechnologicalAxis;
  cor: string;
  corBg: string;
  totalMatriculas: number;
  percentualNacional: number;
  totalCursos: number;
  drsOfertantes: string[];
}

export const EIXO_AGGREGATES: EixoAggregate[] = EIXOS_TECNOLOGICOS.map((e) => {
  const axisCourses = COURSES_DATA.filter((c) => c.eixoTecnologico === e.nome);
  const totalMat = axisCourses.reduce((acc, c) => acc + c.totalMatriculas, 0);
  const allDrs = Array.from(new Set(axisCourses.flatMap((c) => c.drsOfertantes)));

  return {
    eixo: e.nome,
    cor: e.cor,
    corBg: e.corBg,
    totalMatriculas: totalMat,
    percentualNacional: Number(((totalMat / TOTAL_MATRICULAS) * 100).toFixed(2)),
    totalCursos: axisCourses.length,
    drsOfertantes: allDrs,
  };
}).sort((a, b) => b.totalMatriculas - a.totalMatriculas);
