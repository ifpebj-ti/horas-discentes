// components/FileUploadInput.tsx
import React, { useRef, useState } from 'react';
import { FaUpload, FaTrashAlt, FaSpinner } from 'react-icons/fa';

interface FileUploadInputProps {
  file: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  file,
  onSelect,
  onRemove,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onSelect(selected);
      e.target.value = ''; // <- limpa para permitir reenvio do mesmo arquivo
    }
  };

  return (
    <div className="flex flex-col text-sm text-[#1351B4]">
      <label
        className={`border border-dashed rounded px-4 py-2 flex items-center gap-2 cursor-pointer transition
          ${isHovered ? 'bg-blue-100' : 'bg-white'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        htmlFor="file-upload"
      >
        <FaUpload className="text-[#1351B4]" />
        <span className="italic">Selecione o arquivo</span>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 mt-4 text-gray-600">
          <FaSpinner className="animate-spin text-blue-500" />
          <span>Carregando...</span>
        </div>
      )}

      {/* File Uploaded */}
      {file && !isLoading && (
        <div className="flex justify-between items-center mt-4 text-[#1351B4]">
          <span className="truncate max-w-[70%]">{file.name}</span>
          <span className="text-sm text-gray-500">
            {(file.size / 1024).toFixed(2)} KB
          </span>
          <button onClick={onRemove} className="ml-2 hover:text-red-600">
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};
