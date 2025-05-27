import { ReactNode } from 'react';

type RoundedButtonProps = {
  text: string;
  icon?: ReactNode;
  textColor?: string;
  bgColor?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export const RoundedButton = ({
  text,
  icon,
  textColor = 'text-white',
  bgColor = 'bg-blue-700',
  onClick,
  type = 'button',
  disabled = false
}: RoundedButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-8 py-2 rounded-full font-medium transition w-full
        ${bgColor} ${textColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}
      `}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};
