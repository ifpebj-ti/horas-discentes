import React from 'react';
import { Controller } from 'react-hook-form';
import {
  FaClock,
  FaFileAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBookOpen,
  FaBuilding,
  FaAlignLeft
} from 'react-icons/fa';

import { FileUploadInput } from '@components/FileUploadInput';
import SelectBox from '@components/ui/SelectBox';

import { useFormRegistroHoras } from './hooks/useFormRegistroHoras';

interface Categoria {
  nome: string;
}

interface FormRegistroHorasProps {
  categoriasComplementares: Categoria[];
  categoriasExtensao: Categoria[];
}

export default function FormRegistroHoras({
  categoriasComplementares,
  categoriasExtensao
}: Readonly<FormRegistroHorasProps>) {
  const {
    formMethods,
    control,
    handleSubmit,
    submitForm,
    handleFileSelect,
    handleFileRemove,
    anexoComprovante,
    isLoading,
    errors,
    tipoRegistro
  } = useFormRegistroHoras();

  const { register } = formMethods;

  /** Categorias exibidas conforme o tipo de registro */
  const categoriasAtuais =
    tipoRegistro === 'horas-extensao'
      ? categoriasExtensao
      : categoriasComplementares;

  const inputClass =
    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClass = 'text-red-500 text-xs mt-1';

  /** Gera períodos letivos AAAA.1 / AAAA.2 */
  const periodosLetivos = (() => {
    const periodos: string[] = [];
    const anoInicio = 2023;
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1;

    for (let ano = anoInicio; ano < anoAtual; ano++) {
      periodos.push(`${ano}.1`, `${ano}.2`);
    }
    periodos.push(`${anoAtual}.1`);
    if (mesAtual >= 8) periodos.push(`${anoAtual}.2`);
    return periodos;
  })();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-x-auto">
      <div
        className="
          w-full max-w-5xl mx-auto p-4 md:p-8 bg-white
          rounded-2xl shadow-md
          overflow-hidden
        "
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaClock className="text-blue-600" />
          {tipoRegistro === 'horas-extensao'
            ? 'Registrar Horas de Extensão'
            : 'Registrar Horas Complementares'}
        </h2>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* ---------- Primeira linha ---------- */}
          <div className="col-span-1">
            <label htmlFor="tituloAtividade" className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Título da Atividade
              </span>
            </label>
            <input
              id="tituloAtividade"
              type="text"
              {...register('tituloAtividade')}
              placeholder="Digite o título da atividade"
              className={inputClass}
            />
            {errors.tituloAtividade && (
              <p className={errorClass}>{errors.tituloAtividade.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label htmlFor="instituicao" className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaBuilding className="text-blue-600" /> Instituição
              </span>
            </label>
            <input
              id="instituicao"
              type="text"
              {...register('instituicao')}
              placeholder="Digite o nome da instituição"
              className={inputClass}
            />
            {errors.instituicao && (
              <p className={errorClass}>{errors.instituicao.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label htmlFor="localRealizacao" className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" /> Local de
                Realização/Participação
              </span>
            </label>
            <input
              id="localRealizacao"
              type="text"
              {...register('localRealizacao')}
              placeholder="Ex: Auditório principal, Plataforma online"
              className={inputClass}
            />
            {errors.localRealizacao && (
              <p className={errorClass}>{errors.localRealizacao.message}</p>
            )}
          </div>

          {/* ---------- Segunda linha ---------- */}
          <div className="col-span-1">
            <label htmlFor="categoria"
              className="block mb-1 max-w-fit font-medium">
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Categoria
              </span>
            </label>
            <Controller
              control={control}
              name="categoria"
              render={({ field }) => (
                <SelectBox
                  value={field.value}
                  onChange={field.onChange}
                  options={categoriasAtuais.map((c) => ({
                    value: c.nome,
                    label: c.nome
                  }))}
                  error={errors.categoria?.message}
                />
              )}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="periodoLetivoFaculdade"
              className="block mb-1 font-medium"
            >
              <span className="flex items-center gap-2">
                <FaBookOpen className="text-blue-600" /> Período Letivo
              </span>
            </label>
            <select
              id="periodoLetivoFaculdade"
              {...register('periodoLetivoFaculdade')}
              className={inputClass}
            >
              <option value="">Selecione</option>
              {periodosLetivos.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {periodo}
                </option>
              ))}
            </select>
            {errors.periodoLetivoFaculdade && (
              <p className={errorClass}>
                {errors.periodoLetivoFaculdade.message}
              </p>
            )}
          </div>

          {/* ---------- Terceira linha ---------- */}
          <div className="col-span-1">
            <label htmlFor="cargaHoraria" className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaClock className="text-blue-600" /> Carga Horária (horas)
              </span>
            </label>
            <input
              id="cargaHoraria"
              type="number"
              {...register('cargaHoraria')}
              placeholder="Ex: 10"
              className={inputClass}
              min={1}
            />
            {errors.cargaHoraria && (
              <p className={errorClass}>{errors.cargaHoraria.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="dataInicioAtividade"
              className="block mb-1 font-medium"
            >
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" /> Data de Início
              </span>
            </label>
            <input
              id="dataInicioAtividade"
              type="date"
              {...register('dataInicioAtividade')}
              className={inputClass}
            />
            {errors.dataInicioAtividade && (
              <p className={errorClass}>{errors.dataInicioAtividade.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="dataFimAtividade"
              className="block mb-1 font-medium"
            >
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" /> Data de Fim
              </span>
            </label>
            <input
              id="dataFimAtividade"
              type="date"
              {...register('dataFimAtividade')}
              className={inputClass}
            />
            {errors.dataFimAtividade && (
              <p className={errorClass}>{errors.dataFimAtividade.message}</p>
            )}
          </div>

          <div className="col-span-1">
            <label htmlFor="totalPeriodos" className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaBookOpen className="text-blue-600" /> Total de Períodos da
                Atividade
              </span>
            </label>
            <input
              id="totalPeriodos"
              type="number"
              {...register('totalPeriodos')}
              placeholder="Ex: 2"
              className={inputClass}
              min={1}
            />
            {errors.totalPeriodos && (
              <p className={errorClass}>{errors.totalPeriodos.message}</p>
            )}
          </div>

          {/* ---------- Quarta linha ---------- */}
          <div className="col-span-1 md:col-span-3">
            <label
              htmlFor="especificacaoAtividade"
              className="block mb-1 font-medium"
            >
              <span className="flex items-center gap-2">
                <FaAlignLeft className="text-blue-600" /> Especificação das
                Atividades
              </span>
            </label>
            <textarea
              id="especificacaoAtividade"
              {...register('especificacaoAtividade')}
              placeholder="Descreva a atividade complementar/extensão"
              className={`${inputClass} h-24`}
              rows={3}
            />
            {errors.especificacaoAtividade && (
              <p className={errorClass}>
                {errors.especificacaoAtividade.message}
              </p>
            )}
          </div>

          {/* ---------- Quinta linha ---------- */}
          <div className="col-span-1 md:col-span-3">
            <label
              htmlFor="anexoComprovante"
              className="block mb-1 font-medium"
            >
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Anexar Comprovante
              </span>
            </label>
            <Controller
              name="anexoComprovante"
              control={control}
              render={({ fieldState: { error } }) => (
                <>
                  <FileUploadInput
                    file={anexoComprovante}
                    onSelect={handleFileSelect}
                    onRemove={handleFileRemove}
                    isLoading={isLoading}
                  />
                  {error && <p className={errorClass}>{error.message}</p>}
                </>
              )}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tipos aceitos: PDF, JPG, PNG. Tamanho máx: 5&nbsp;MB.
            </p>
          </div>

          {/* ---------- Botão ---------- */}
          <div className="col-span-1 md:col-span-3 flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="
                bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
