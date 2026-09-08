import React from 'react'
import { Link } from 'react-router-dom'
import { RiLockPasswordLine } from 'react-icons/ri'

const AccessDenied = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4 font-sans">
      <div className="w-full max-w-[550px] rounded-2xl bg-white p-8 sm:p-12 text-center shadow-sm border border-gray-100">
        
        {/* Ícone de Cadeado Fechado com um X */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#E8F0EC] text-[#123C2C]">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9.5 12.5l5 5m0-5l-5 5" 
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Acesso Negado
        </h1>

        {/* Descrição */}
        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-[420px] mx-auto">
          Desculpe, você não tem permissão para acessar esta página. 
          Isso pode acontecer se você não estiver logado ou não tiver os privilégios necessários.
        </p>

        {/* Botão de Ação Principal */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#123C2C] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1a5640] transition-colors"
          >
            Voltar à Página Inicial
          </Link>
        </div>

        {/* Link Secundário */}
        <div className="mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors"
          >
            Entrar em outra conta
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AccessDenied