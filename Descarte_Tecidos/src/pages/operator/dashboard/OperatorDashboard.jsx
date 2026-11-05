import React from 'react';
import { useNavigate } from 'react-router-dom';

const OperatorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[800px] font-sans">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Resumo das atividades do ponto de coleta.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200/80 rounded-2xl mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-lg">
            📍
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Ponto de Coleta Centro</h2>
            <p className="text-xs text-gray-400 mt-0.5">Rua das Flores, 123 - Centro, São Paulo/SP</p>
          </div>
        </div>
        <span className="mt-3 sm:mt-0 px-3 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full self-start sm:self-auto">
          Ativo
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        
        <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
          <div className="text-xl mb-3">📦</div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">5</div>
          <div className="text-xs text-gray-400 font-medium">Recebimentos hoje</div>
          <div className="text-xs font-bold text-emerald-600 mt-2">+ 2</div>
        </div>

        <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
          <div className="text-xl mb-3">🗓️</div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">48</div>
          <div className="text-xs text-gray-400 font-medium">Total no mês</div>
          <div className="text-xs font-bold text-emerald-600 mt-2">+ 12%</div>
        </div>

        <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
          <div className="text-xl mb-3">⚖️</div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">278 kg</div>
          <div className="text-xs text-gray-400 font-medium">Peso total</div>
          <div className="text-xs font-bold text-emerald-600 mt-2">+ 8%</div>
        </div>

      </div>
      <button 
        onClick={() => navigate('/operator/receber')}
        className="w-full py-3.5 bg-[#153b2d] hover:bg-[#0d2a1f] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
      >
        📦 Registrar recebimento
      </button>

    </div>
  );
};

export default OperatorDashboard;