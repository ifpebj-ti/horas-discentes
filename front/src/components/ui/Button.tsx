import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1351B4] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1351B4] disabled:opacity-50`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Enviando...' : children}
    </button>
  );
};

export default Button;
