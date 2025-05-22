import Link from 'next/link';
import React from 'react';

interface Categoria {
  readonly nome: string;
  readonly horas: number;
  readonly total: number;
  readonly categoriaKey: string;
}

interface ProgressoGeralProps {
  readonly categorias: readonly Categoria[];
  readonly totalHoras: number;
  readonly totalNecessarias: number;
}

export default function ProgressoGeral({
  categorias,
  totalHoras,
  totalNecessarias
}: ProgressoGeralProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 col-span-2">
      <h2 className="text-lg font-semibold mb-4">Progresso Geral</h2>

      <p className="text-sm font-medium mb-1">Total de Horas Complementares</p>
      <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{ width: `${(totalHoras / totalNecessarias) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mb-4">
        {totalHoras} / {totalNecessarias} horas
      </p>

      <p className="text-sm font-medium mb-1">Progresso por Categoria</p>
      {categorias.map((cat) => {
        const hasHours = cat.horas > 0;
        return (
          <div key={cat.nome} className="mb-3">
            <Link
              href={`/aluno/certificado?category=${encodeURIComponent(cat.categoriaKey)}`}
              className={`
                text-sm
                ${hasHours
                  ? 'text-blue-600 font-semibold underline hover:text-blue-700 cursor-pointer'
                  : 'text-gray-500 font-medium hover:text-blue-600 cursor-pointer'}
              `}
              tabIndex={0}
            >
              {cat.nome}
            </Link>

            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(cat.horas / cat.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {cat.horas} / {cat.total} horas
            </p>
          </div>
        );
      })}
    </div>
  );
}
