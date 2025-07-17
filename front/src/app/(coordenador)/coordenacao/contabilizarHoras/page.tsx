'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaDownload, FaCheckSquare, FaSquare } from 'react-icons/fa';

import LoadingOverlay from '@/components/LoadingOverlay'; // Ajuste o caminho se necessário
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Imports dos seus Services e Hooks
import { useLoadingOverlay } from '@/hooks/useLoadingOverlay'; // Ajuste o caminho se necessário
import {
  listarConcluidosComplementar,
  listarConcluidosExtensao,
  marcarDownloadComplementar,
  marcarDownloadExtensao,
  AlunoComHorasConcluidasResponse
} from '@/services/alunoService';
import {
  obterCoordenadorAutenticado,
  type CoordenadorInfoResponse
} from '@/services/coordenadorService';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';

// ----------------------------------------------------------------
// Componente Skeleton
// ----------------------------------------------------------------
const TabelaSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  const skeletonKeys = useMemo(
    () => Array.from({ length: rows }, () => crypto.randomUUID()),
    [rows]
  );
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
            {skeletonKeys.map((key) => (
              <tr key={key} className="border-b border-border">
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
  /* ------------------ Estados de dados da API ----------- */
  const [alunos, setAlunos] = useState<AlunoComHorasConcluidasResponse[]>([]);
  const [coordenadorInfo, setCoordenadorInfo] =
    useState<CoordenadorInfoResponse | null>(null);

  /* ------------------ Estados de filtro ------------------ */
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<
    'finalizados' | 'concluidos'
  >('finalizados');

  /* ------------------ Estados de seleção ----------------- */
  const [alunosSelecionados, setAlunosSelecionados] = useState<Set<string>>(
    new Set()
  );

  /* ------------------ Paginação -------------------------- */
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  /* ------------------ Visão & Categoria ------------------ */
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<
    'horasComplementares' | 'extensao' | null
  >(null);

  /* ------------------ Estado de Carregamento ------------- */
  const [isTableLoading, setIsTableLoading] = useState(false);
  const {
    visible: isProcessing,
    show: showProcessingOverlay,
    hide: hideProcessingOverlay
  } = useLoadingOverlay();

  // Busca dados do coordenador ao montar o componente
  useEffect(() => {
    const fetchCoordenador = async () => {
      try {
        const data = await obterCoordenadorAutenticado();
        setCoordenadorInfo(data);
      } catch (error) {
        console.error('Erro ao buscar dados do coordenador:', error);
        // Tratar erro (ex: exibir toast)
      }
    };
    fetchCoordenador();
  }, []);

  // Busca alunos quando uma categoria é selecionada
  useEffect(() => {
    const fetchAlunos = async () => {
      if (!selectedCategory) {
        setAlunos([]);
        return;
      }

      setIsTableLoading(true);
      try {
        const data =
          selectedCategory === 'horasComplementares'
            ? await listarConcluidosComplementar()
            : await listarConcluidosExtensao();
        setAlunos(data);
      } catch (error) {
        console.error(`Erro ao buscar alunos de ${selectedCategory}:`, error);
        setAlunos([]);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchAlunos();
  }, [selectedCategory]);

  /* ========================================================
   * FILTRO + PAGINAÇÃO
   * ======================================================*/
  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const matchNome =
        aluno.nome?.toLowerCase().includes(filtroNome.toLowerCase()) ?? true;
      const matchMatricula = aluno.matricula?.includes(filtroMatricula) ?? true;
      const matchStatus =
        filtroStatus === 'finalizados'
          ? aluno.cargaHorariaFinalizada && !aluno.jaFezDownload
          : aluno.jaFezDownload;

      // O filtro de categoria já é feito na busca da API, mas mantemos aqui por segurança
      return matchNome && matchMatricula && matchStatus;
    });
  }, [alunos, filtroNome, filtroMatricula, filtroStatus]);

  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina) || 1;
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const alunosPaginados = alunosFiltrados.slice(indiceInicio, indiceFim);

  /* --------------------------------------------------------
   * Seleção de linhas
   * -----------------------------------------------------*/
  const toggleSelecionarTodos = () => {
    if (alunosSelecionados.size === alunosPaginados.length) {
      setAlunosSelecionados(new Set());
    } else {
      setAlunosSelecionados(new Set(alunosPaginados.map((a) => a.id)));
    }
  };

  const toggleSelecionarAluno = (id: string) => {
    const nova = new Set(alunosSelecionados);
    if (nova.has(id)) {
      nova.delete(id);
    } else {
      nova.add(id);
    }
    setAlunosSelecionados(nova);
  };

  /* --------------------------------------------------------
   * Download e atualização de Status
   * -----------------------------------------------------*/

  const handleDownloadAlunosSelecionados = async () => {
    if (
      alunosSelecionados.size === 0 ||
      !coordenadorInfo ||
      !selectedCategory
    ) {
      alert('Selecione ao menos um aluno para o download.');
      return;
    }

    showProcessingOverlay();
    try {
      const selecionados = alunos.filter((a) => alunosSelecionados.has(a.id));
      selecionados.sort((a, b) => a.nome?.localeCompare(b.nome ?? '') ?? 0);

      const response = await fetch('/docs/Coordenador-Requerimento.docx');
      const templateBuffer = await response.arrayBuffer();

      for (const aluno of selecionados) {
        const certs = aluno.certificados.map((cert, idx) => ({
          idx: idx + 1,
          title: cert.titulo,
          cargaHoraria: cert.cargaHoraria,
          periodo: `${cert.periodoInicio} a ${cert.periodoFim}`
        }));

        const docxVars = {
          Coordenador: coordenadorInfo.nome,
          curso: coordenadorInfo.curso,
          Portaria: coordenadorInfo.numeroPortaria,
          DOU: coordenadorInfo.dou,
          alunos: [
            {
              estudante: aluno.nome,
              matricula: aluno.matricula,
              carga: aluno.cargaHoraria
            }
          ],
          certs
        };

        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true
        });
        doc.setData(docxVars);
        doc.render();

        const out = doc.getZip().generate({ type: 'blob' });
        saveAs(out, `contabilizacao_${aluno.nome?.replace(/\s/g, '_')}.docx`);

        // Após o download, atualiza o status no backend
        if (selectedCategory === 'horasComplementares') {
          await marcarDownloadComplementar(aluno.id);
        } else {
          await marcarDownloadExtensao(aluno.id);
        }
      }

      // Limpa a seleção e recarrega os dados para atualizar a UI
      setAlunosSelecionados(new Set());
      // Força a recarga disparando o useEffect novamente
      const currentCategory = selectedCategory;
      setSelectedCategory(null); // reseta para forçar a mudança
      setTimeout(() => setSelectedCategory(currentCategory), 10);
    } catch (error) {
      console.error('Ocorreu um erro no processo de download:', error);
      alert(
        'Ocorreu um erro. Verifique o console para mais detalhes e tente novamente.'
      );
    } finally {
      hideProcessingOverlay();
    }
  };

  /* --------------------------------------------------------
   * Resetar página quando filtros mudarem
   * -----------------------------------------------------*/
  useEffect(() => {
    setPaginaAtual(1);
    setAlunosSelecionados(new Set());
  }, [filtroNome, filtroMatricula, filtroStatus, selectedCategory]);

  const todosSelecionados =
    alunosPaginados.length > 0 &&
    alunosSelecionados.size === alunosPaginados.length;

  /* ========================================================
   * RENDERIZAÇÃO
   * ======================================================*/
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <LoadingOverlay show={isProcessing} />
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Gerenciamento de Horas dos Alunos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie a contabilização de horas dos alunos
        </p>
      </div>

      {/* ============================== VISÃO: CARDS ============================== */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => {
              setSelectedCategory('horasComplementares');
              setViewMode('table');
            }}
            className="bg-card border border-border rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Horas Complementares
            </h2>
            <p className="text-muted-foreground text-sm">
              Gerencie as horas complementares dos alunos.
            </p>
          </div>
          <div
            onClick={() => {
              setSelectedCategory('extensao');
              setViewMode('table');
            }}
            className="bg-card border border-border rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Extensão
            </h2>
            <p className="text-muted-foreground text-sm">
              Gerencie as horas de extensão dos alunos.
            </p>
          </div>
        </div>
      )}

      {/* ============================== VISÃO: TABELA ============================= */}
      {viewMode === 'table' && (
        <>
          <Button
            variant="outline"
            onClick={() => {
              setViewMode('cards');
              setSelectedCategory(null);
            }}
            className="mb-4"
            size="sm"
          >
            Voltar para Seleção de Categoria
          </Button>

          <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">Filtros</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-2.5 text-primary w-4 h-4" />
                <Input
                  placeholder="Filtrar por nome..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-2.5 text-primary w-4 h-4" />
                <Input
                  placeholder="Filtrar por matrícula..."
                  value={filtroMatricula}
                  onChange={(e) => setFiltroMatricula(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={filtroStatus === 'finalizados' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('finalizados')}
                size="sm"
              >
                Pendentes de Download
                <Badge variant="secondary" className="ml-2">
                  {alunos.filter((a) => !a.jaFezDownload).length}
                </Badge>
              </Button>
              <Button
                variant={filtroStatus === 'concluidos' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('concluidos')}
                size="sm"
              >
                Downloads Realizados
                <Badge variant="secondary" className="ml-2">
                  {alunos.filter((a) => a.jaFezDownload).length}
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Exibindo {alunosPaginados.length > 0 ? indiceInicio + 1 : 0}-
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
              disabled={alunosSelecionados.size === 0 || isProcessing}
              size="sm"
            >
              <FaDownload className="mr-2 h-3 w-3" />
              Baixar e Concluir Selecionados
            </Button>
          </div>

          {isTableLoading ? (
            <TabelaSkeleton rows={itensPorPagina} />
          ) : (
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="bg-muted p-2 sm:p-4 w-12">
                        <button onClick={toggleSelecionarTodos}>
                          {todosSelecionados ? (
                            <FaCheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <FaSquare className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </th>
                      <th className="bg-muted text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold">
                        Nome do Aluno
                      </th>
                      <th className="bg-muted text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold">
                        Matrícula
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosPaginados.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-border">
                        <td className="p-2 sm:p-4 text-center">
                          <button
                            onClick={() => toggleSelecionarAluno(aluno.id)}
                          >
                            {alunosSelecionados.has(aluno.id) ? (
                              <FaCheckSquare className="w-4 h-4 text-primary" />
                            ) : (
                              <FaSquare className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </td>
                        <td className="p-2 sm:p-4 text-xs sm:text-sm">
                          {aluno.nome}
                        </td>
                        <td className="p-2 sm:p-4 text-xs sm:text-sm">
                          {aluno.matricula}
                        </td>
                      </tr>
                    ))}
                    {alunosPaginados.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-6 text-center text-muted-foreground"
                        >
                          Nenhum aluno encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ... (código de paginação mantido igual) ... */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
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
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(1)}
              >
                {'<<'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(paginaAtual - 1)}
              >
                {'<'}
              </Button>
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
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(paginaAtual + 1)}
              >
                {'>'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(totalPaginas)}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GerenciamentoHoras;
