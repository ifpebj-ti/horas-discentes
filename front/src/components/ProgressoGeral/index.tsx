// ProgressoGeral.tsx
import React from 'react';

interface Categoria {
  nome: string;
  horas: number;
  total: number;
}

interface ProgressoGeralProps {
  categorias: Categoria[];
  totalHoras: number;
  totalNecessarias: number;
}

export default function ProgressoGeral({
  categorias,
  totalHoras,
  totalNecessarias,
}: ProgressoGeralProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 col-span-2">
      <h2 className="text-lg font-semibold mb-4">Progresso Geral</h2>

      <p className="text-sm font-medium mb-1">Total de Horas Complementares</p>
      <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{ width: `${(totalHoras / totalNecessarias) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        {totalHoras} / {totalNecessarias} horas
      </p>

      <p className="text-sm font-medium mb-1">Progresso por Categoria</p>
      {categorias.map((cat) => (
        <div key={cat.nome} className="mb-3">
          <p className="text-sm text-gray-800">{cat.nome}</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${(cat.horas / cat.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {cat.horas} / {cat.total} horas
          </p>
        </div>
      ))}
    </div>
  );
}
