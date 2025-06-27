'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FaSearch,
  FaDownload,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ----------------------------------------------------------------
// Tipos 
// ----------------------------------------------------------------
interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  cargaHorariaFinalizada: boolean;
  jaFezDownload: boolean;
  categoria: 'horasComplementares' | 'extensao';
}

// ----------------------------------------------------------------
// Mock de dados (mantido no front apenas para demonstração)
// ----------------------------------------------------------------
const alunosMock: Aluno[] = [
  {
    id: 1,
    nome: 'Ana Silva Santos',
    matricula: '2023001',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'horasComplementares'
  },
  {
    id: 2,
    nome: 'Carlos Eduardo Lima',
    matricula: '2023002',
    cargaHorariaFinalizada: true,
    jaFezDownload: true,
    categoria: 'extensao'
  },
  {
    id: 3,
    nome: 'Maria Fernanda Costa',
    matricula: '2023003',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'horasComplementares'
  },
  {
    id: 4,
    nome: 'João Pedro Oliveira',
    matricula: '2023004',
    cargaHorariaFinalizada: false,
    jaFezDownload: false,
    categoria: 'extensao'
  },
  {
    id: 5,
    nome: 'Beatriz Almeida Rocha',
    matricula: '2023005',
    cargaHorariaFinalizada: true,
    jaFezDownload: true,
    categoria: 'horasComplementares'
  },
  {
    id: 6,
    nome: 'Rafael Santos Pereira',
    matricula: '2023006',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'extensao'
  },
  {
    id: 7,
    nome: 'Juliana Martins Silva',
    matricula: '2023007',
    cargaHorariaFinalizada: false,
    jaFezDownload: false,
    categoria: 'horasComplementares'
  },
  {
    id: 8,
    nome: 'Pedro Henrique Souza',
    matricula: '2023008',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'extensao'
  },
  {
    id: 9,
    nome: 'Camila Rodrigues Lima',
    matricula: '2023009',
    cargaHorariaFinalizada: true,
    jaFezDownload: true,
    categoria: 'horasComplementares'
  },
  {
    id: 10,
    nome: 'Lucas Gabriel Santos',
    matricula: '2023010',
    cargaHorariaFinalizada: false,
    jaFezDownload: false,
    categoria: 'extensao'
  },
  {
    id: 11,
    nome: 'Amanda Cristina Alves',
    matricula: '2023011',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'horasComplementares'
  },
  {
    id: 12,
    nome: 'Gustavo Silva Ferreira',
    matricula: '2023012',
    cargaHorariaFinalizada: true,
    jaFezDownload: true,
    categoria: 'extensao'
  },
  {
    id: 13,
    nome: 'Erison Silva Ferreira',
    matricula: '2023112',
    cargaHorariaFinalizada: true,
    jaFezDownload: false,
    categoria: 'horasComplementares'
  }
];

// ----------------------------------------------------------------
// Componente Skeleton
// ----------------------------------------------------------------
const TabelaSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="bg-muted py-3 px-2 sm:px-4 w-12">
                <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
              </th>
              <th className="bg-muted text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">
                <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse" />
              </th>
              <th className="bg-muted text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">
                <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b border-border">
                <td className="py-3 px-2 sm:px-4">
                  <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="h-4 w-48 bg-muted-foreground/20 rounded animate-pulse" />
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------
const GerenciamentoHoras: React.FC = () => {
  /* ------------------ Estados de filtro ------------------ */
  const [filtroNome, setFiltroNome]           = useState('');
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroStatus, setFiltroStatus]       = useState<'finalizados' | 'concluidos'>(
    'finalizados'
  );

  /* ------------------ Estados de seleção ----------------- */
  const [alunosSelecionados, setAlunosSelecionados] = useState<Set<number>>(new Set());

  /* ------------------ Paginação -------------------------- */
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  /* ------------------ Visão & Categoria ------------------ */
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<'horasComplementares' | 'extensao' | null>(
    null
  );

  /* ------------------ Estado de Carregamento ------------- */
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simula 1.5s de carregamento
    return () => clearTimeout(timer);
  }, []);

  /* ========================================================
   *  FILTRO + PAGINAÇÃO
   * ======================================================*/
  const alunosFiltrados = useMemo(() => {
    return alunosMock.filter((aluno) => {
      const matchNome      = aluno.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const matchMatricula = aluno.matricula.includes(filtroMatricula);

      const matchStatus =
        filtroStatus === 'finalizados'
          ? aluno.cargaHorariaFinalizada && !aluno.jaFezDownload
          : aluno.jaFezDownload;

      const matchCategory = selectedCategory ? aluno.categoria === selectedCategory : true;

      return matchNome && matchMatricula && matchStatus && matchCategory;
    });
  }, [filtroNome, filtroMatricula, filtroStatus, selectedCategory]);

  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina) || 1;
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim    = indiceInicio + itensPorPagina;
  const alunosPaginados = alunosFiltrados.slice(indiceInicio, indiceFim);

  /* --------------------------------------------------------
   *  Seleção de linhas
   * -----------------------------------------------------*/
  const toggleSelecionarTodos = () => {
    if (alunosSelecionados.size === alunosPaginados.length) {
      setAlunosSelecionados(new Set());
    } else {
      setAlunosSelecionados(new Set(alunosPaginados.map((a) => a.id)));
    }
  };

  const toggleSelecionarAluno = (id: number) => {
    const nova = new Set(alunosSelecionados);
    nova.has(id) ? nova.delete(id) : nova.add(id);
    setAlunosSelecionados(nova);
  };

  /* --------------------------------------------------------
   *  Download (mock)
   * -----------------------------------------------------*/
  const handleDownloadAlunosSelecionados = () => {
    if (alunosSelecionados.size === 0) return alert('Selecione pelo menos um aluno.');

    console.log('Baixando dados dos alunos:', Array.from(alunosSelecionados));
    alert('Informações baixadas com sucesso!');
    setAlunosSelecionados(new Set());
  };

  /* --------------------------------------------------------
   *  Resetar página quando filtros mudarem
   * -----------------------------------------------------*/
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroMatricula, filtroStatus, selectedCategory]);

  const todosSelecionados = alunosPaginados.length > 0 && alunosSelecionados.size === alunosPaginados.length;
  const algunsSelecionados = alunosSelecionados.size > 0 && alunosSelecionados.size < alunosPaginados.length;

  /* ========================================================
   *  RENDERIZAÇÃO
   * ======================================================*/
   return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gerenciamento de Horas dos Alunos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gerencie a contabilização de horas dos alunos</p>
      </div>

      {/* ============================== VISÃO: CARDS ============================== */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Horas Complementares */}
          <div
            onClick={() => {
              setSelectedCategory('horasComplementares');
              setViewMode('table');
            }}
            className="bg-card border border-border rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">Horas Complementares</h2>
            <p className="text-muted-foreground text-sm">Gerencie as horas complementares dos alunos.</p>
          </div>

          {/* Card Extensão */}
          <div
            onClick={() => {
              setSelectedCategory('extensao');
              setViewMode('table');
            }}
            className="bg-card border border-border rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">Extensão</h2>
            <p className="text-muted-foreground text-sm">Gerencie as horas de extensão dos alunos.</p>
          </div>
        </div>
      )}

      {/* ============================== VISÃO: TABELA ============================= */}
      {viewMode === 'table' && (
        <>
          {/* Botão voltar */}
          <Button
            variant="outline"
            onClick={() => {
              setViewMode('cards');
              setSelectedCategory(null);
              setFiltroNome('');
              setFiltroMatricula('');
              setFiltroStatus('finalizados');
            }}
            className="mb-4"
            size="sm"
          >
            Voltar para Seleção de Categoria
          </Button>

          {/* -------------------- FILTROS -------------------- */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">Filtros</h2>

            {/* Busca */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="filtro-nome" className="block text-sm font-medium text-foreground">Nome do Aluno</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    id="filtro-nome"
                    placeholder="Digite o nome do aluno"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="filtro-matricula" className="block text-sm font-medium text-foreground">Matrícula</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    id="filtro-matricula"
                    placeholder="Digite a matrícula"
                    value={filtroMatricula}
                    onChange={(e) => setFiltroMatricula(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Status</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant={filtroStatus === 'finalizados' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('finalizados')}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <span className="text-xs sm:text-sm">Carga Horária Finalizada</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {alunosMock.filter((a) => a.cargaHorariaFinalizada && !a.jaFezDownload && (!selectedCategory || a.categoria === selectedCategory)).length}
                  </Badge>
                </Button>

                <Button
                  variant={filtroStatus === 'concluidos' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('concluidos')}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <span className="text-xs sm:text-sm">Já Concluídos</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {alunosMock.filter((a) => a.jaFezDownload && (!selectedCategory || a.categoria === selectedCategory)).length}
                  </Badge>
                </Button>
              </div>
            </div>
          </div>

          {/* -------------------- AÇÕES & INFO -------------------- */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Exibindo {indiceInicio + 1}-{Math.min(indiceFim, alunosFiltrados.length)} de {alunosFiltrados.length} alunos
              {alunosSelecionados.size > 0 && (
                <span className="ml-2 font-medium text-primary">({alunosSelecionados.size} selecionados)</span>
              )}
            </div>
            <Button
              onClick={handleDownloadAlunosSelecionados}
              disabled={alunosSelecionados.size === 0}
              size="sm"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <FaDownload className="w-3 h-3" />
              <span className="text-xs sm:text-sm">Baixar informações</span>
            </Button>
          </div>

          {/* -------------------- TABELA -------------------- */}
          {isLoading ? (
            <TabelaSkeleton rows={itensPorPagina} />
          ) : (
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="bg-muted py-3 px-2 sm:px-4 w-12">
                        <button
                          onClick={toggleSelecionarTodos}
                          aria-label={todosSelecionados ? 'Desmarcar todos' : 'Selecionar todos'}
                          className="flex items-center justify-center w-full p-1 hover:bg-muted/50 rounded"
                        >
                          {todosSelecionados ? (
                            <FaCheckSquare className="w-4 h-4 text-primary" />
                          ) : algunsSelecionados ? (
                            <div className="w-4 h-4 bg-primary/50 border border-primary rounded" />
                          ) : (
                            <FaSquare className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </th>
                      <th className="bg-muted text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">Nome do Aluno</th>
                      <th className="bg-muted text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosPaginados.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-2 sm:px-4">
                          <button
                            onClick={() => toggleSelecionarAluno(aluno.id)}
                            aria-label={alunosSelecionados.has(aluno.id) ? 'Desmarcar ' + aluno.nome : 'Selecionar ' + aluno.nome}
                            className="flex items-center justify-center w-full p-1 hover:bg-muted/50 rounded"
                          >
                            {alunosSelecionados.has(aluno.id) ? (
                              <FaCheckSquare className="w-4 h-4 text-primary" />
                            ) : (
                              <FaSquare className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-foreground">{aluno.nome}</td>
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-foreground">{aluno.matricula}</td>
                      </tr>
                    ))}
                    {alunosPaginados.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-muted-foreground text-sm">
                          Nenhum aluno encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------- PAGINAÇÃO -------------------- */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Itens por página */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Itens por página:</span>
              <select
                value={itensPorPagina}
                onChange={(e) => {
                  setItensPorPagina(Number(e.target.value));
                  setPaginaAtual(1);
                }}
                className="w-20 px-2 py-1 border border-input rounded-md text-xs sm:text-sm focus:outline-none"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Navegação */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Button variant="outline" size="sm" disabled={paginaAtual === 1} onClick={() => setPaginaAtual(1)}>{'<<'}</Button>
              <Button variant="outline" size="sm" disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)}>{'<'}</Button>

              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let page = 1;
                if (totalPaginas <= 5) {
                  page = i + 1;
                } else if (paginaAtual <= 3) {
                  page = i + 1;
                } else if (paginaAtual >= totalPaginas - 2) {
                  page = totalPaginas - 4 + i;
                } else {
                  page = paginaAtual - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={paginaAtual === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaginaAtual(page)}
                    className="min-w-[2rem] text-xs"
                  >
                    {page}
                  </Button>
                );
              })}

              <Button variant="outline" size="sm" disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(paginaAtual + 1)}>{'>'}</Button>
              <Button variant="outline" size="sm" disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(totalPaginas)}>{'>>'}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GerenciamentoHoras; 
