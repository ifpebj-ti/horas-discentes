'use client';
import Image from 'next/image';
import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

import { RoundedButton } from '@/components/RoundedButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    alert('Enviando dados para login...');
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-start md:items-center justify-center bg-white pt-4 pb-0">
        <Image
          src="/login.svg"
          alt="Login"
          width={400}
          height={400}
          className="w-auto h-auto max-w-[300px] md:max-w-[400px]"
        />
      </div>

      <div className="flex flex-col justify-center items-center px-6 md:px-12 pb-4 md:pb-0">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#1351B4] pb-2 mb-8 tracking-wide drop-shadow-sm">
            Horas Complementares
          </h1>

          <div className="mb-4">
            <label className="block mb-1 text-sm">Email:</label>
            <div className="flex items-center border rounded px-3 py-2 text-sm">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Digite seu email institucional."
                className="flex-1 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-1">
            <label className="block mb-1 text-sm">Senha:</label>
            <div className="flex items-center border rounded px-3 py-2 text-sm">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha de segurança."
                className="flex-1 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FiEyeOff
                  className={`ml-2 cursor-pointer ${
                    password ? 'text-[#1351B4]' : 'text-gray-400'
                  }`}
                  onClick={() => password && setShowPassword(false)}
                />
              ) : (
                <FiEye
                  className={`ml-2 cursor-pointer ${
                    password ? 'text-[#1351B4]' : 'text-gray-400'
                  }`}
                  onClick={() => password && setShowPassword(true)}
                />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            Digite sua senha de segurança.
          </p>

          <div className="text-right mb-4">
            <a href="#" className="text-sm text-[#1351B4] hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <div className="flex items-center mb-6">
            <input type="checkbox" id="keepConnected" className="mr-2" />
            <label htmlFor="keepConnected" className="text-sm">
              Manter-me conectado
            </label>
          </div>

          <div className="w-full">
            <RoundedButton
              text="Entrar"
              bgColor="bg-[#1351B4]"
              textColor="text-white"
              onClick={handleLogin}
            />
          </div>

          <hr className="my-6 border-t-2 border-gray-300 rounded-2xl" />

          <div className="text-center">
            <a href="#" className="text-[#1351B4] font-medium hover:underline">
              Primeiro Acesso?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
