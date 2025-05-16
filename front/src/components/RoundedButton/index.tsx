import { ReactNode } from 'react';

type RoundedButtonProps = {
  text: string;
  icon?: ReactNode;
  textColor?: string; // ex: "text-white"
  bgColor?: string; // ex: "bg-blue-700"
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export const RoundedButton = ({
  text,
  icon,
  textColor = 'text-white',
  bgColor = 'bg-blue-700',
  onClick,
  type = 'button'
}: RoundedButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full ${bgColor} ${textColor} font-medium transition hover:opacity-90 w-full cursor-pointer`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};
