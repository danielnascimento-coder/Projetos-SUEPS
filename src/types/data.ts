export type RegionName = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export interface RegionalDepartment {
  sigla: string;
  nome: string;
  regiao: RegionName;
  capital: string;
}

export type TechnologicalAxis =
  | 'Infraestrutura'
  | 'Gestão e Negócios'
  | 'Produção Cultural e Design'
  | 'Controle e Processos Industriais'
  | 'Ambiente e Saúde'
  | 'Recursos Naturais';

export interface CourseOffering {
  dr: string;
  drNome: string;
  regiao: RegionName;
  matriculas: number;
}

export interface RawCourseData {
  id: string;
  drRaw: string;
  curso: string;
  matriculasRaw: string;
  eixoTecnologico: TechnologicalAxis;
  descricao?: string;
  ofertas: CourseOffering[];
  totalMatriculas: number;
  drsOfertantes: string[];
  isMultiDR: boolean;
}

export interface FlattenedRecord {
  id: string;
  curso: string;
  dr: string;
  drNome: string;
  regiao: RegionName;
  matriculas: number;
  eixoTecnologico: TechnologicalAxis;
  isMultiDR: boolean;
  totalCursoMatriculas: number;
  drsDoCurso: string[];
}

export interface FilterState {
  search: string;
  eixo: string; // 'all' or specific axis
  regiao: string; // 'all' or specific region
  dr: string; // 'all' or specific DR
  tipoOferta: 'all' | 'multi' | 'single';
  faixaMatricula: 'all' | 'high' | 'medium' | 'niche'; // >500, 50-500, <50
}
