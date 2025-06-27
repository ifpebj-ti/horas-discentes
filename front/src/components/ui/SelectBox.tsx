import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
}
interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: Option[];
  error?: string;
}

export default function SelectBox({
  value,
  onChange,
  options,
  placeholder = 'Selecione',
  error
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Fecha ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full px-4 py-2 border rounded-lg flex justify-between items-center
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : ''}
        `}
      >
        <span className={value ? '' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <FaChevronDown className="ml-2 text-sm" />
      </button>

      {open && (
        <ul
          className="
          absolute z-20 mt-1 left-0
          min-w-full md:min-w-[24rem]   /* ≥ md garante pelo menos 24 rem */
          max-w-[calc(100%-2rem)]      /* nunca passa do card (deixa 1 rem de folga em cada lado) */
          bg-white border rounded-lg shadow
          max-h-56 overflow-y-auto
        "
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                px-4 py-2 cursor-pointer hover:bg-blue-50
                whitespace-normal break-words
                ${value === opt.value ? 'bg-blue-100' : ''}
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
