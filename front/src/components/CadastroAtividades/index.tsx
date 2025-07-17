'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaGraduationCap, FaUsers, FaPlus } from 'react-icons/fa';

import { AtividadeCard } from '@/components/AtividadeCard';
import { AtividadeForm } from '@/components/AtividadeForm';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  listarAtividadesPorCurso,
  criarAtividade
} from '@/services/atividadeService';
import {
  CreateAtividadeRequest,
  AtividadeResponse
} from '@/services/atividadeService';
import { TipoAtividade } from '@/types/atividade';
import Swal from 'sweetalert2';

interface CadastroAtividadesProps {
  cursoId: string;
}

export function CadastroAtividades({ cursoId }: CadastroAtividadesProps) {
  const [atividades, setAtividades] = useState<AtividadeResponse[]>([]);
  const [tipoAtual, setTipoAtual] = useState<TipoAtividade>('COMPLEMENTAR');
  const [showForm, setShowForm] = useState(false);

  const { visible, show, hide } = useLoadingOverlay();

  const fetchAtividades = useCallback(async () => {
    try {
      show();
      const dados = await listarAtividadesPorCurso(cursoId);
      setAtividades(dados);
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao buscar atividades',
        text: 'Tente novamente mais tarde.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      hide();
    }
  }, [cursoId, show, hide]);

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  const atividadesFiltradas = atividades.filter((a) => a.tipo === tipoAtual);

  const handleAddAtividade = async (
    data: Omit<CreateAtividadeRequest, 'cursoId' | 'tipo'>
  ) => {
    const tipoMap = {
      COMPLEMENTAR: 1,
      EXTENSAO: 0
    };
    const dadosParaEnvio: CreateAtividadeRequest = {
      ...data,
      cursoId,
      tipo: tipoMap[tipoAtual]
    };

    try {
      show();
      await criarAtividade(dadosParaEnvio);

      await Swal.fire({
        icon: 'success',
        title: 'Atividade cadastrada!',
        text: 'A atividade foi adicionada com sucesso.',
        confirmButtonColor: '#4f46e5'
      });

      setShowForm(false);
      await fetchAtividades();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text:
          error?.response?.data?.message ||
          'Ocorreu um erro ao cadastrar a atividade.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      hide();
    }
  };

  const handleTabChange = (value: string) => {
    setTipoAtual(value as TipoAtividade);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <LoadingOverlay show={visible} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Cadastro de Atividades do Curso
        </h1>
        <p className="text-muted-foreground">
          Gerencie as atividades complementares e de extensão disponíveis para o
          curso
        </p>
      </div>

      <Tabs
        value={tipoAtual}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger
            value="COMPLEMENTAR"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FaGraduationCap className="h-4 w-4" />
            Complementares
          </TabsTrigger>
          <TabsTrigger
            value="EXTENSAO"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FaUsers className="h-4 w-4" />
            Extensão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="COMPLEMENTAR" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Atividades Complementares
              </h2>
              <p className="text-muted-foreground">
                {atividadesFiltradas.length} atividade
                {atividadesFiltradas.length !== 1 ? 's' : ''} cadastrada
                {atividadesFiltradas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaPlus className="h-4 w-4" />
              Adicionar Atividade
            </Button>
          </div>

          {showForm && (
            <AtividadeForm
              tipo="COMPLEMENTAR"
              onSubmit={handleAddAtividade}
              onCancel={() => setShowForm(false)}
              isVisible={showForm}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atividadesFiltradas.map((atividade) => (
              <AtividadeCard key={atividade.id} atividade={atividade} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="EXTENSAO" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Atividades de Extensão</h2>
              <p className="text-muted-foreground">
                {atividadesFiltradas.length} atividade
                {atividadesFiltradas.length !== 1 ? 's' : ''} cadastrada
                {atividadesFiltradas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaPlus className="h-4 w-4" />
              Adicionar Atividade
            </Button>
          </div>

          {showForm && (
            <AtividadeForm
              tipo="EXTENSAO"
              onSubmit={handleAddAtividade}
              onCancel={() => setShowForm(false)}
              isVisible={showForm}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atividadesFiltradas.map((atividade) => (
              <AtividadeCard key={atividade.id} atividade={atividade} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
