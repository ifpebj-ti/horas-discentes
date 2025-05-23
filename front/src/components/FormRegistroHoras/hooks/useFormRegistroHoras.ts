import { useSearchParams } from 'next/navigation'; // Para obter o 'tipo'
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { FormRegistroHorasSchema } from '@components/FormRegistroHoras/schemas/formRegistroHorasSchema';

export function useFormRegistroHoras(/* props: UseFormRegistroHorasProps */) {
  const searchParams = useSearchParams();
  const tipoRegistro = searchParams.get('tipo') || 'horas-complementares'; // 'horas-complementares' ou 'horas-extensao'

  const [isUploading, setIsUploading] = useState(false); // Estado para o loading do upload

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
      especificacaoAtividade: '',
      anexoComprovante: null
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

  // Observa o valor do arquivo para passar para o FileUploadInput
  const anexoComprovante = watch('anexoComprovante');

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
    setIsUploading(true); // Simula início do upload
    console.log('Dados do formulário:', data);
    // Aqui você faria a chamada para sua API, enviando `data`
    // Exemplo:
    // try {
    //   const formDataApi = new FormData();
    //   Object.keys(data).forEach(key => {
    //     if (key === 'anexoComprovante' && data.anexoComprovante) {
    //       formDataApi.append(key, data.anexoComprovante);
    //     } else {
    //       formDataApi.append(key, String(data[key as keyof FormRegistroHorasSchema]));
    //     }
    //   });
    //   // await api.post('/sua-rota-de-upload', formDataApi);
    //   toast.success('Horas registradas com sucesso!');
    //   form.reset(); // Limpa o formulário após o sucesso
    // } catch (error) {
    //   toast.error('Erro ao registrar horas. Tente novamente.');
    //   console.error("Erro na submissão:", error);
    // } finally {
    //   setIsUploading(false);
    // }

    // Simulação de chamada API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    toast.success(
      `Horas de ${tipoRegistro === 'horas-extensao' ? 'Extensão' : 'Complementares'} registradas com sucesso!`
    );
    console.log('Dados enviados (simulação):', data);
    form.reset(); // Limpa o formulário
  };

  return {
    formMethods: form, // Retorna todos os métodos do react-hook-form se necessário
    control,
    handleSubmit,
    submitForm,
    handleFileSelect,
    handleFileRemove,
    anexoComprovante, // O arquivo para o FileUploadInput
    isLoading: isSubmitting || isUploading, // Combina o estado de submissão do form com o de upload
    errors, // Para exibir erros nos campos
    tipoRegistro // Para o título dinâmico e seleção de categorias
  };
}
