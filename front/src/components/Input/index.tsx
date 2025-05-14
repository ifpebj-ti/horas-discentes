import { InputHTMLAttributes } from 'react';
import { IconType } from 'react-icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, ...props }) => {
  return (
    <div className="flex items-center border rounded px-3 py-2 text-sm">
      {Icon && <Icon className="text-gray-500 mr-2" />}
      <input
        {...props}
        className="flex-1 outline-none text-sm placeholder:text-gray-500"
      />
    </div>
  );
};
