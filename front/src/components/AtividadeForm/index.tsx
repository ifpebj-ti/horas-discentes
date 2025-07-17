'use client';

import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAtividadeForm } from './hooks/useAtividadeForm';
import { AtividadeFormSchema } from './schemas/schema';

interface Props {
  tipo: 'EXTENSAO' | 'COMPLEMENTAR';
  onSubmit: (data: AtividadeFormSchema) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export function AtividadeForm({ onSubmit, onCancel, isVisible }: Props) {
  const { isSubmitting, register, handleSubmit, errors, handleFormSubmit } =
    useAtividadeForm({ onSubmit });

  if (!isVisible) return null;

  return (
    <Card className="shadow-elegant animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FaPlus className="h-4 w-4 text-primary" />
            Nova Atividade
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="cursor-pointer"
          >
            <FaTimes className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome da Atividade *</Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Digite o nome da atividade"
              />
              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="grupo">Grupo *</Label>
              <Input
                id="grupo"
                {...register('grupo')}
                placeholder="Ex: I, II, III"
              />
              {errors.grupo && (
                <p className="text-sm text-destructive">
                  {errors.grupo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <Input
                id="categoria"
                {...register('categoria')}
                placeholder="Ex: Categoria 1"
              />
              {errors.categoria && (
                <p className="text-sm text-destructive">
                  {errors.categoria.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="categoriaKey">Área *</Label>
              <Input
                id="categoriaKey"
                {...register('categoriaKey')}
                placeholder="Ensino, Pesquisa, Extensão"
              />
              {errors.categoriaKey && (
                <p className="text-sm text-destructive">
                  {errors.categoriaKey.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cargaMaximaSemestral">
                Carga Máxima Semestral *
              </Label>
              <Input
                id="cargaMaximaSemestral"
                type="number"
                {...register('cargaMaximaSemestral', { valueAsNumber: true })}
                placeholder="Ex: 60"
              />
              {errors.cargaMaximaSemestral && (
                <p className="text-sm text-destructive">
                  {errors.cargaMaximaSemestral.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cargaMaximaCurso">Carga Máxima do Curso *</Label>
              <Input
                id="cargaMaximaCurso"
                type="number"
                {...register('cargaMaximaCurso', { valueAsNumber: true })}
                placeholder="Ex: 120"
              />
              {errors.cargaMaximaCurso && (
                <p className="text-sm text-destructive">
                  {errors.cargaMaximaCurso.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              <FaSave className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Atividade'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
