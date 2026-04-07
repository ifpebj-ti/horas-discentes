'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaGraduationCap, FaUsers, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { ActivityCard } from '@/components/ActivityCard';
import { ActivityForm } from '@/components/ActivityForm';
import LoadingOverlay from '@/components/LoadingOverlay';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  listarAtividades,
  criarAtividade,
  deletarAtividade
} from '@/services/activityService';
import {
  CreateAtividadeRequest,
  AtividadeResponse
} from '@/services/activityService';
import { TipoAtividade } from '@/types/atividade';

export function ActivityRegistration() {
  const [atividades, setAtividades] = useState<AtividadeResponse[]>([]);
  const [tipoAtual, setTipoAtual] = useState<TipoAtividade>('COMPLEMENTAR');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const { visible, show, hide } = useLoadingOverlay();

  const fetchAtividades = useCallback(async () => {
    try {
      show();
      const dados = await listarAtividades();
      setAtividades(dados);
    } catch {
      toast.error('Erro ao buscar atividades. Tente novamente mais tarde.');
    } finally {
      hide();
    }
  }, [show, hide]);

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  const atividadesFiltradas = atividades.filter((a) => a.tipo === tipoAtual);

  const handleAddAtividade = async (
    data: Omit<CreateAtividadeRequest, 'tipo'>
  ) => {
    const tipoMap = {
      COMPLEMENTAR: 1,
      EXTENSAO: 0
    };
    const dadosParaEnvio: CreateAtividadeRequest = {
      ...data,
      tipo: tipoMap[tipoAtual]
    };

    try {
      show();
      await criarAtividade(dadosParaEnvio);
      toast.success('A atividade foi adicionada com sucesso.');
      setShowForm(false);
      await fetchAtividades();
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(
        error?.response?.data?.message ||
          'Ocorreu um erro ao cadastrar a atividade.'
      );
    } finally {
      hide();
    }
  };

  const confirmDeleteAtividade = async () => {
    if (!deleteTarget) return;

    try {
      show();
      await deletarAtividade(deleteTarget.id);
      await fetchAtividades();
      toast.success('A atividade foi removida com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      toast.error(
        'Não foi possível excluir a atividade. Tente novamente mais tarde.'
      );
    } finally {
      hide();
      setDeleteTarget(null);
    }
  };

  const handleTabChange = (value: string) => {
    setTipoAtual(value as TipoAtividade);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <LoadingOverlay show={visible} />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir a atividade &quot;{deleteTarget?.nome}
              &quot;? Esta ação é permanente e removerá todos os vínculos com
              alunos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteAtividade}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Cadastro de Atividades
        </h1>
        <p className="text-muted-foreground">
          Gerencie as atividades complementares e de extensão disponíveis para
          todos os cursos
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
            <ActivityForm
              tipo="COMPLEMENTAR"
              onSubmit={handleAddAtividade}
              onCancel={() => setShowForm(false)}
              isVisible={showForm}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atividadesFiltradas.map((atividade) => (
              <ActivityCard
                key={atividade.id}
                atividade={atividade}
                onDelete={(id, nome) => setDeleteTarget({ id, nome })}
              />
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
            <ActivityForm
              tipo="EXTENSAO"
              onSubmit={handleAddAtividade}
              onCancel={() => setShowForm(false)}
              isVisible={showForm}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atividadesFiltradas.map((atividade) => (
              <ActivityCard
                key={atividade.id}
                atividade={atividade}
                onDelete={(id, nome) => setDeleteTarget({ id, nome })}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
