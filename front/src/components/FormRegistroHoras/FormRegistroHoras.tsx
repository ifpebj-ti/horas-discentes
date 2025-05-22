"use client";

import { FaClock, FaFileAlt, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";

interface FormRegistroHorasProps {
  formData: {
    title: string;
    institution: string;
    category: string;
    hours: string;
    date: string;
    description: string;
    file: File | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
}

export default function FormRegistroHoras({ formData, onInputChange, onFileChange, onFormSubmit }: FormRegistroHorasProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClock className="text-blue-600" />
        Registrar Horas Complementares
      </h2>

      <form onSubmit={onFormSubmit} className="flex flex-col space-y-4">
        {/* Título */}
        <div>
          <label className="block mb-1 font-medium">
            <span className="flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Título da Atividade
            </span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Digite o título da atividade"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Instituição */}
        <div>
          <label className="block mb-1 font-medium">
            <span className="flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Instituição
            </span>
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={onInputChange}
            placeholder="Digite o nome da instituição"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1 font-medium">
            <span className="flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Descrição
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Descreva a atividade"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="flex gap-4">
          {/* Categoria */}
          <div className="flex-1">
            <label className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-blue-600" />
                Categoria
              </span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Ensino">Ensino</option>
              <option value="Pesquisa">Pesquisa</option>
              <option value="Extensão">Extensão</option>
              <option value="Gestão">Gestão</option>
              <option value="Monitoria">Monitoria</option>
              <option value="Iniciação Científica">Iniciação Científica</option>
            </select>
          </div>

          {/* Carga Horária */}
          <div className="flex-1">
            <label className="block mb-1 font-medium">
              <span className="flex items-center gap-2">
                <FaClock className="text-blue-600" />
                Carga Horária
              </span>
            </label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={onInputChange}
              placeholder="Ex.: 10"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              required
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block mb-1 font-medium">
            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              Data da Atividade
            </span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Anexo */}
        <div>
          <label className="block mb-1 font-medium">
            <span className="flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Anexar Comprovante
            </span>
          </label>
          <input
            type="file"
            name="file"
            onChange={onFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Botão */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
