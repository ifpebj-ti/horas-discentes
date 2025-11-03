import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FormRegistroHorasSchema } from '@components/FormRegistroHoras/schemas/formRegistroHorasSchema';

import { AtividadeResponse } from '@/services/atividadeService';
import { enviarCertificado } from '@/services/certificadoService';
import Swal from 'sweetalert2';

export interface UseFormRegistroHorasProps {
  categoriasComplementares: AtividadeResponse[];
  categoriasExtensao: AtividadeResponse[];
}

export function useFormRegistroHoras({
  categoriasComplementares,
  categoriasExtensao
}: UseFormRegistroHorasProps) {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  const tipoRegistro = searchParams.get('tipo') ?? 'horas-complementares';

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormRegistroHorasSchema>({
    defaultValues: {
      tituloAtividade: '',
      instituicao: '',
      localRealizacao: '',
      categoria: '',
      periodoLetivoFaculdade: '',
      cargaHoraria: 0,
      dataInicioAtividade: '',
      dataFimAtividade: '',
      totalPeriodos: 1,
      especificacaoAtividade: '',
      anexoComprovante: null,
      aceitarTermos: false
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = form;

  const anexoComprovante = watch('anexoComprovante');

  const categoriasAtuais = useMemo(() => {
    return tipoRegistro === 'horas-extensao'
      ? categoriasExtensao
      : categoriasComplementares;
  }, [tipoRegistro, categoriasComplementares, categoriasExtensao]);

  const handleFileSelect = (file: File) => {
    setValue('anexoComprovante', file, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleFileRemove = () => {
    setValue('anexoComprovante', null, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const submitForm: SubmitHandler<FormRegistroHorasSchema> = async (data) => {
    try {
      if (!session?.user?.entidadeId || !session?.user?.cursoId) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro de autenticação',
          text: 'Usuário não autenticado ou curso não identificado.'
        });
        return;
      }

      const atividadeSelecionada = categoriasAtuais.find(
        (c) => c.nome === data.categoria
      );

      if (!atividadeSelecionada) {
        await Swal.fire({
          icon: 'error',
          title: 'Categoria inválida',
          text: 'Categoria não encontrada ou inválida.'
        });
        return;
      }

      const dataInicioUTC = new Date(
        data.dataInicioAtividade + 'T00:00:00Z'
      ).toISOString();

      const dataFimUTC = new Date(
        data.dataFimAtividade + 'T00:00:00Z'
      ).toISOString();

      const formData = new FormData();
      formData.append('TituloAtividade', data.tituloAtividade);
      formData.append('Instituicao', data.instituicao);
      formData.append('Local', data.localRealizacao);
      formData.append('Categoria', atividadeSelecionada.categoria);
      formData.append('Grupo', atividadeSelecionada.grupo);
      formData.append('PeriodoLetivo', data.periodoLetivoFaculdade);
      formData.append('CargaHoraria', data.cargaHoraria.toString());
      formData.append('DataInicio', dataInicioUTC);
      formData.append('DataFim', dataFimUTC);
      formData.append('TotalPeriodos', data.totalPeriodos.toString());
      if (data.especificacaoAtividade) {
        formData.append('Descricao', data.especificacaoAtividade);
      }
      formData.append('AlunoId', session.user.entidadeId);
      formData.append('AtividadeId', atividadeSelecionada.id);
      formData.append('Tipo', tipoRegistro === 'horas-extensao' ? '0' : '1');
      if (data.anexoComprovante) {
        formData.append('Anexo', data.anexoComprovante);
      }

      setIsUploading(true);
      await enviarCertificado(formData);

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Certificado enviado com sucesso.'
      });

      form.reset();
      router.push('/aluno/certificado');
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao enviar',
        text: 'Não foi possível enviar o certificado.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formMethods: form,
    control,
    handleSubmit,
    submitForm,
    handleFileSelect,
    handleFileRemove,
    anexoComprovante,
    isLoading: isSubmitting || isUploading,
    errors,
    tipoRegistro
  };
}
