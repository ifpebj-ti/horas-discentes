'use client';

import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Interface de propriedades para o componente Modal.
 * onConfirm é opcional para permitir que o modal funcione como um simples alerta.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Removido '?' para garantir que seja sempre uma função
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'approve' | 'reject' | 'alert';
}

export const PopUpModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'alert'
}) => {
  // Se o modal não estiver aberto, não renderiza nada na tela.
  if (!isOpen) return null;

  // Mapeia as variantes para estilos específicos (ícones e cores de botão)
  const variantStyles = {
    approve: {
      bg: 'bg-green-600 hover:bg-green-700',
      icon: <FaCheckCircle className="text-green-500 text-3xl" />
    },
    reject: {
      bg: 'bg-red-600 hover:bg-red-700',
      icon: <FaTimesCircle className="text-red-500 text-3xl" />
    },
    alert: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      icon: <FaInfoCircle className="text-blue-500 text-3xl" />
    }
  };

  const selectedStyle = variantStyles[variant];

  // Determina se o modal é apenas um alerta (sem botão de cancelar)
  const isAlert = variant === 'alert';

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity"
      aria-modal="true"
      aria-labelledby="modal-title"
      open={isOpen} // Controla a visibilidade do dialog
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4 transform transition-all">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {selectedStyle.icon}
            <h3
              id="modal-title"
              className="text-xl font-semibold text-gray-800"
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        {/* Corpo do Modal (conteúdo dinâmico) */}
        <div className="p-6 text-gray-600">{children}</div>

        {/* Rodapé do Modal com os botões de ação */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
          {/* O botão 'Cancelar' só aparece se não for um alerta */}
          {!isAlert && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
            >
              {cancelText}
            </button>
          )}

          {/* Botão principal: 'Confirmar' ou 'OK' */}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white font-semibold transition ${selectedStyle.bg}`}
          >
            {isAlert ? 'OK' : confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};
