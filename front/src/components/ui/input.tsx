'use client';

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleInfo,
  faEye,
  faEyeSlash,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  icon?: IconDefinition;
  isPassword?: boolean;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon, isPassword = false, helperText, errorText, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="flex flex-col gap-2 w-full">
        <div
          className={cn(
            'flex items-center border rounded-xs px-3 py-2 transition-all',
            props.disabled
              ? 'bg-gray-100 border-gray-300'
              : 'bg-white border-gray-400 focus-within:ring-2 focus-within:ring-blue-500'
          )}
        >
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className={cn(
                'mr-2 shrink-0',
                props.disabled ? 'text-gray-400' : 'text-gray-500'
              )}
            />
          )}
          <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none',
              'disabled:cursor-not-allowed disabled:text-gray-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="ml-2 text-gray-500 cursor-pointer focus:outline-none shrink-0"
              onClick={() => setShowPassword((v) => !v)}
              disabled={props.disabled}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          )}
        </div>

        {helperText && (
          <div className="flex items-center bg-[#155BCB] text-white w-min text-nowrap text-sm p-1 gap-1">
            <FontAwesomeIcon icon={faCircleInfo} />
            {helperText}
          </div>
        )}

        {errorText && (
          <div className="flex items-center bg-red-500 text-white w-min text-nowrap text-sm p-1 gap-1">
            <FontAwesomeIcon icon={faCircleXmark} />
            {errorText}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
