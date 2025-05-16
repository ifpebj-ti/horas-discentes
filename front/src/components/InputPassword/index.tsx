import { InputHTMLAttributes, useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

type InputPasswordProps = InputHTMLAttributes<HTMLInputElement>;

export const InputPassword: React.FC<InputPasswordProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasText, setHasText] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e);
    const hasContent = e.target.value.length > 0;
    setHasText(hasContent);
    if (!hasContent) setShowPassword(false);
  };

  return (
    <div className="flex items-center border rounded px-3 py-2 text-sm">
      <FaLock className="text-gray-500 mr-2" />
      <input
        type={showPassword ? 'text' : 'password'}
        {...props}
        onChange={handleChange}
        className="flex-1 outline-none text-sm"
      />
      {showPassword ? (
        <FaEyeSlash
          className="ml-2 cursor-pointer text-[#1351B4]"
          onClick={() => hasText && setShowPassword(false)}
        />
      ) : (
        <FaEye
          className={`ml-2 cursor-pointer ${hasText ? 'text-[#1351B4]' : 'text-gray-400'}`}
          onClick={() => hasText && setShowPassword(true)}
        />
      )}
    </div>
  );
};
