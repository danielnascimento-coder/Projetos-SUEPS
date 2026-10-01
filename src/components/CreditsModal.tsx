import React from 'react';
import { Award, BookOpen, CheckCircle2, Users, X, ExternalLink } from 'lucide-react';
import { TOTAL_CURSOS, TOTAL_DRS, TOTAL_MATRICULAS, TOTAL_REGIOES } from '../data/coursesData';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002855] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#005CAA] flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold tracking-tight">
                Créditos e Ficha Técnica
              </h2>
              <p className="text-xs text-blue-200">
                SENAI · Serviço Nacional de Aprendizagem Industrial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Attribution */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-[#005CAA] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Créditos Oficiais: Equipe de Itinerários Nacionais do SENAI
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Este painel analítico foi desenvolvido a partir do levantamento sistemático conduzido pela{' '}
                  <strong className="text-slate-900">Equipe de Itinerários Nacionais do SENAI Nacional</strong>,
                  responsável pelo monitoramento, estruturação curricular e harmonização da oferta formativa da
                  educação profissional e tecnológica nos 27 Departamentos Regionais.
                </p>
              </div>
            </div>
          </div>

          {/* Context and Purpose */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Contexto do Levantamento
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              O presente conjunto de dados contempla cursos técnicos ofertados pelos Departamentos
              Regionais (DRs) que <strong>não constavam na Base Nacional do SENAI</strong>. Esses cursos
              refletem demandas industriais locais emergentes, vocações econômicas regionais consolidadas
              ou arranjos produtivos específicos que demandam análise contínua para subsidiar a
              atualização dos itinerários nacionais.
            </p>
          </div>

          {/* Key Metrics of the Dataset */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 block">Total Mapeado</span>
              <span className="text-lg font-bold font-mono text-[#005CAA] tabular-nums">
                {TOTAL_MATRICULAS.toLocaleString('pt-BR')}
              </span>
              <span className="text-[11px] text-slate-500 block">matrículas</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 block">Cursos Técnicos</span>
              <span className="text-lg font-bold font-mono text-slate-800 tabular-nums">
                {TOTAL_CURSOS}
              </span>
              <span className="text-[11px] text-slate-500 block">títulos únicos</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 block">DRs Ofertantes</span>
              <span className="text-lg font-bold font-mono text-slate-800 tabular-nums">
                {TOTAL_DRS}
              </span>
              <span className="text-[11px] text-slate-500 block">estados</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 block">Macrorregiões</span>
              <span className="text-lg font-bold font-mono text-slate-800 tabular-nums">
                {TOTAL_REGIOES}
              </span>
              <span className="text-[11px] text-slate-500 block">do Brasil</span>
            </div>
          </div>

          {/* Methodological Notes */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critérios Metodológicos e Referências
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-none">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Catálogo Nacional de Cursos Técnicos (CNCT):</strong> Classificação baseada nos eixos
                  tecnológicos da 4ª edição do CNCT/MEC.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Ofertas Compartilhadas:</strong> Cursos com múltiplos DRs (separados por barra na fonte original)
                  foram devidamente desmembrados com a alocação exata de matrículas de cada regional.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Acessibilidade & Padrões Web:</strong> Paleta com contraste WCAG AA/AAA e conformidade
                  para todos os perfis de usuários.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            SENAI Departamento Nacional · Gerência de Educação Profissional
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#005CAA] hover:bg-[#004587] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
