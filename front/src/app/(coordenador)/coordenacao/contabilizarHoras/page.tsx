'use client';
import React, { useState, useMemo } from 'react';
import { FaSearch, FaDownload, FaCheckSquare, FaSquare } from 'react-icons/fa';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  cargaHorariaFinalizada: boolean;
  jaFezDownload: boolean;
}

// Dados mock para demonstração
const alunosMock: Aluno[] = [
  {
    id: 1,
    nome: 'Ana Silva Santos',
    matricula: '2023001',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  },
  {
    id: 2,
    nome: 'Carlos Eduardo Lima',
    matricula: '2023002',
    cargaHorariaFinalizada: true,
    jaFezDownload: true
  },
  {
    id: 3,
    nome: 'Maria Fernanda Costa',
    matricula: '2023003',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  },
  {
    id: 4,
    nome: 'João Pedro Oliveira',
    matricula: '2023004',
    cargaHorariaFinalizada: false,
    jaFezDownload: false
  },
  {
    id: 5,
    nome: 'Beatriz Almeida Rocha',
    matricula: '2023005',
    cargaHorariaFinalizada: true,
    jaFezDownload: true
  },
  {
    id: 6,
    nome: 'Rafael Santos Pereira',
    matricula: '2023006',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  },
  {
    id: 7,
    nome: 'Juliana Martins Silva',
    matricula: '2023007',
    cargaHorariaFinalizada: false,
    jaFezDownload: false
  },
  {
    id: 8,
    nome: 'Pedro Henrique Souza',
    matricula: '2023008',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  },
  {
    id: 9,
    nome: 'Camila Rodrigues Lima',
    matricula: '2023009',
    cargaHorariaFinalizada: true,
    jaFezDownload: true
  },
  {
    id: 10,
    nome: 'Lucas Gabriel Santos',
    matricula: '2023010',
    cargaHorariaFinalizada: false,
    jaFezDownload: false
  },
  {
    id: 11,
    nome: 'Amanda Cristina Alves',
    matricula: '2023011',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  },
  {
    id: 12,
    nome: 'Gustavo Silva Ferreira',
    matricula: '2023012',
    cargaHorariaFinalizada: true,
    jaFezDownload: true
  },
  {
    id: 13,
    nome: 'Erison Silva Ferreira',
    matricula: '2023112',
    cargaHorariaFinalizada: true,
    jaFezDownload: false
  }
];

const GerenciamentoHoras: React.FC = () => {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<
    'finalizados' | 'concluidos'
  >('finalizados');
  const [alunosSelecionados, setAlunosSelecionados] = useState<Set<number>>(
    new Set()
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  // Filtrar alunos com base nos critérios
  const alunosFiltrados = useMemo(() => {
    return alunosMock.filter((aluno) => {
      const matchNome = aluno.nome
        .toLowerCase()
        .includes(filtroNome.toLowerCase());
      const matchMatricula = aluno.matricula.includes(filtroMatricula);

      let matchStatus = false;
      if (filtroStatus === 'finalizados') {
        matchStatus = aluno.cargaHorariaFinalizada && !aluno.jaFezDownload;
      } else if (filtroStatus === 'concluidos') {
        matchStatus = aluno.jaFezDownload;
      }

      return matchNome && matchMatricula && matchStatus;
    });
  }, [filtroNome, filtroMatricula, filtroStatus]);

  // Paginação
  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const alunosPaginados = alunosFiltrados.slice(indiceInicio, indiceFim);

  // Funções de seleção
  const toggleSelecionarTodos = () => {
    if (alunosSelecionados.size === alunosPaginados.length) {
      setAlunosSelecionados(new Set());
    } else {
      setAlunosSelecionados(new Set(alunosPaginados.map((aluno) => aluno.id)));
    }
  };

  const toggleSelecionarAluno = (alunoId: number) => {
    const novaSelecao = new Set(alunosSelecionados);
    if (novaSelecao.has(alunoId)) {
      novaSelecao.delete(alunoId);
    } else {
      novaSelecao.add(alunoId);
    }
    setAlunosSelecionados(novaSelecao);
  };

  // Função de download
  const handleDownloadAlunosSelecionados = () => {
    if (alunosSelecionados.size === 0) {
      alert('Selecione pelo menos um aluno.');
      return;
    }

    // Simular chamada ao backend
    console.log(
      'Baixando informações dos alunos:',
      Array.from(alunosSelecionados)
    );
    alert('Informações baixadas com sucesso!');
    setAlunosSelecionados(new Set()); // Limpar seleção após download
  };

  // Reset da paginação quando filtros mudam
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroMatricula, filtroStatus]);

  const todosSelecionados =
    alunosPaginados.length > 0 &&
    alunosSelecionados.size === alunosPaginados.length;
  const algunsSelecionados =
    alunosSelecionados.size > 0 &&
    alunosSelecionados.size < alunosPaginados.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Gerenciamento de Horas dos Alunos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie a contabilização de horas dos alunos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">Filtros</h2>

        {/* Campos de busca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="filtro-nome"
              className="block text-sm font-medium text-foreground"
            >
              Nome do Aluno
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1351B4] w-4 h-4" />
              <Input
                id="filtro-nome"
                type="text"
                placeholder="Digite o nome do aluno"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="filtro-matricula"
              className="block text-sm font-medium text-foreground"
            >
              Matrícula
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1351B4] w-4 h-4" />
              <Input
                id="filtro-matricula"
                type="text"
                placeholder="Digite a matrícula"
                value={filtroMatricula}
                onChange={(e) => setFiltroMatricula(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Toggle Group para Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Status
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={filtroStatus === 'finalizados' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('finalizados')}
              className="w-full sm:w-auto justify-center sm:justify-start"
              size="sm"
            >
              <span className="text-xs sm:text-sm">
                Carga Horária Finalizada
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {
                  alunosMock.filter(
                    (a) => a.cargaHorariaFinalizada && !a.jaFezDownload
                  ).length
                }
              </Badge>
            </Button>
            <Button
              variant={filtroStatus === 'concluidos' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('concluidos')}
              className="w-full sm:w-auto justify-center sm:justify-start"
              size="sm"
            >
              <span className="text-xs sm:text-sm">Já Concluídos</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {alunosMock.filter((a) => a.jaFezDownload).length}
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Informações e Botão de Download */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Exibindo {indiceInicio + 1}-
          {Math.min(indiceFim, alunosFiltrados.length)} de{' '}
          {alunosFiltrados.length} alunos
          {alunosSelecionados.size > 0 && (
            <span className="ml-2 font-medium text-primary">
              ({alunosSelecionados.size} selecionados)
            </span>
          )}
        </div>

        <Button
          onClick={handleDownloadAlunosSelecionados}
          disabled={alunosSelecionados.size === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
          size="sm"
        >
          <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">
            Baixar informações dos alunos selecionados
          </span>
        </Button>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-spacing-0">
            <thead>
              <tr className="border-b border-border">
                <th className="bg-muted text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm w-12">
                  <button
                    onClick={toggleSelecionarTodos}
                    className="flex items-center justify-center w-full p-1 hover:bg-muted/50 rounded transition-colors"
                    aria-label={
                      todosSelecionados ? 'Desmarcar todos' : 'Selecionar todos'
                    }
                  >
                    {todosSelecionados ? (
                      <FaCheckSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    ) : algunsSelecionados ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary/50 border border-primary rounded" />
                    ) : (
                      <FaSquare className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                <th className="bg-muted text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-foreground">
                  Nome do Aluno
                </th>
                <th className="bg-muted text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-foreground">
                  Matrícula
                </th>
              </tr>
            </thead>
            <tbody>
              {alunosPaginados.map((aluno) => (
                <tr
                  key={aluno.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-2 sm:px-4">
                    <button
                      onClick={() => toggleSelecionarAluno(aluno.id)}
                      className="flex items-center justify-center w-full p-1 hover:bg-muted/50 rounded transition-colors"
                      aria-label={`${alunosSelecionados.has(aluno.id) ? 'Desmarcar' : 'Selecionar'} ${aluno.nome}`}
                    >
                      {alunosSelecionados.has(aluno.id) ? (
                        <FaCheckSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      ) : (
                        <FaSquare className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm text-foreground">
                    {aluno.nome}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-foreground">
                    {aluno.matricula}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {alunosPaginados.length === 0 && (
            <div className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
              Nenhum aluno encontrado com os filtros aplicados.
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">Itens por página:</span>
          <select
            value={itensPorPagina}
            onChange={(e) => {
              setItensPorPagina(Number(e.target.value));
              setPaginaAtual(1);
            }}
            className="w-16 sm:w-20 px-2 py-1 border border-input rounded-md bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(1)}
            disabled={paginaAtual === 1}
            className="text-xs px-2 py-1 h-8"
          >
            {'<<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="text-xs px-2 py-1 h-8"
          >
            {'<'}
          </Button>

          {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
            let pageNum;
            if (totalPaginas <= 5) {
              pageNum = i + 1;
            } else if (paginaAtual <= 3) {
              pageNum = i + 1;
            } else if (paginaAtual >= totalPaginas - 2) {
              pageNum = totalPaginas - 4 + i;
            } else {
              pageNum = paginaAtual - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={paginaAtual === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaginaAtual(pageNum)}
                className="text-xs px-2 py-1 h-8 min-w-[2rem]"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="text-xs px-2 py-1 h-8"
          >
            {'>'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(totalPaginas)}
            disabled={paginaAtual === totalPaginas}
            className="text-xs px-2 py-1 h-8"
          >
            {'>>'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GerenciamentoHoras;
