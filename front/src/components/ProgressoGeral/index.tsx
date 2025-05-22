'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Categoria {
  readonly nome: string;
  readonly horas: number;
  readonly total: number;
  readonly categoriaKey: string;
  readonly grupo: string;
}

interface ProgressoGeralProps {
  readonly categorias: readonly Categoria[];
  readonly totalHoras: number;
  readonly totalNecessarias: number;
  readonly title?: string;
  readonly subTitle?: string;
  readonly categoriaKey?: string;
  readonly onCategoriaClick?: (categoriaKey: string) => void;
}

export default function ProgressoGeral({
  categorias,
  totalHoras,
  totalNecessarias,
  title,
  subTitle,
  categoriaKey,
  onCategoriaClick
}: ProgressoGeralProps) {
  const [expanded, setExpanded] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Cabeçalho com botão de expandir */}
      <button
        className="w-full flex items-center justify-between mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-sm font-medium text-gray-700">
          {subTitle}
        </span>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 mr-2">
            {totalHoras} / {totalNecessarias} horas
          </span>
          {expanded ? (
            <FaChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <FaChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Barra de progresso total */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{ width: `${Math.min((totalHoras / totalNecessarias) * 100, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mb-2">
        {totalHoras} de {totalNecessarias} horas
      </p>

      {/* Subcategorias */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {categorias.map((cat) => {
            const percentagem = (cat.horas / cat.total) * 100;
            const isCapped = cat.horas > cat.total;
            const isSelected = categoriaKey === cat.categoriaKey;
            return (
              <div
                key={`${cat.categoriaKey}-${cat.nome}`}
                className={`pl-4 space-y-1 ${isSelected ? 'bg-blue-50 rounded' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/aluno/certificado?category=${encodeURIComponent(cat.categoriaKey)}`}
                    className={`
                      text-sm
                      ${cat.horas > 0
                        ? 'text-blue-600 font-semibold hover:text-blue-700'
                        : 'text-gray-500 hover:text-blue-600'}
                      ${isSelected ? 'underline' : ''}
                    `}
                  >
                    {cat.nome}
                  </Link>
                  <span className="text-sm font-medium text-gray-900">
                    {cat.horas} / {cat.total} horas
                    {isCapped && (
                      <span className="text-yellow-600 text-xs ml-1">
                        (limite atingido)
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(percentagem, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
