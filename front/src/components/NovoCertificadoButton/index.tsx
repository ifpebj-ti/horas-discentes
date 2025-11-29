'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

import * as Types from '@/types';

export default function NovoCertificadoButton({
  user
}: {
  user: Types.Usuario;
}) {
  const [open, setOpen] = useState(false);
  // Regra para exibir opção de Horas de Extensão:
  // - Preferencialmente usa os limites de horas vindos do backend (quando disponíveis);
  // - Se não houver essas informações, cai no comportamento antigo baseado em isNewPPC.
  const hasInfoDeHorasExtensao =
    user.maximoHorasExtensao !== undefined ||
    user.totalHorasExtensao !== undefined;

  const possuiExtensaoPorHoras =
    (user.maximoHorasExtensao ?? 0) > 0 || (user.totalHorasExtensao ?? 0) > 0;

  const extensao = hasInfoDeHorasExtensao
    ? possuiExtensaoPorHoras
    : user.isNewPPC === true;

  function toggleDropdown(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    setOpen((prev) => !prev);
  }

  function closeDropdown() {
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
      >
        <FaPlusCircle />
        Novo Certificado
      </button>

      {open && (
        <div
          role="menu"
          tabIndex={-1}
          className="absolute right-0 z-20 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          onMouseLeave={closeDropdown}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Tab') {
              closeDropdown();
            }
          }}
        >
          <div className="py-2">
            <Link
              href="/aluno/certificado/novo?tipo=horas-complementares"
              className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-500 hover:text-white"
              onClick={closeDropdown}
            >
              Horas Complementares
            </Link>
            {extensao && (
              <Link
                href="/aluno/certificado/novo?tipo=horas-extensao"
                className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-500 hover:text-white"
                onClick={closeDropdown}
              >
                Horas de Extensão
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
