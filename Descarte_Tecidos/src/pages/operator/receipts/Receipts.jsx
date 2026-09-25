import React, { useState } from 'react';
const mockRecebimentos = [
  { id: '#RO0124', data: '11/09/2026', hora: '10:32', material: 'Algodão', quantidade: '10 kg', observacoes: '--', responsavel: 'João Silva' },
  { id: '#RO0125', data: '10/09/2026', hora: '14:15', material: 'Jeans', quantidade: '8 kg', observacoes: 'Bom estado', responsavel: 'Carlos Almeida' },
  { id: '#RO0126', data: '09/09/2026', hora: '09:45', material: 'Poliéster', quantidade: '15 kg', observacoes: '--', responsavel: 'João Silva' },
  { id: '#RO0127', data: '08/09/2026', hora: '11:20', material: 'Algodão', quantidade: '5 kg', observacoes: '--', responsavel: 'Ana Costa' },
  { id: '#RO0128', data: '07/09/2026', hora: '16:05', material: 'Viscose', quantidade: '7 kg', observacoes: '--', responsavel: 'Carlos Almeida' },
  { id: '#RO0129', data: '06/09/2026', hora: '13:10', material: 'Linho', quantidade: '8 kg', observacoes: '--', responsavel: 'João Silva' },
];

const Receipts = () => {
  const [selectedRecebimento, setSelectedRecebimento] = useState(null);
  if (selectedRecebimento) {
    return (
      <div className="w-full font-sans animate-in fade-in duration-300">
        <button 
          onClick={() => setSelectedRecebimento(null)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <span>&larr;</span> Voltar
        </button>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 max-w-sm shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">📦</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">
              Registrado
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-0.5">
            Recebimento {selectedRecebimento.id}
          </h2>
          <p className="text-xs text-gray-400 mb-6 font-medium">
            {selectedRecebimento.data} - {selectedRecebimento.hora}
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">Tipo de material</p>
              <p className="text-sm font-semibold text-gray-800">{selectedRecebimento.material}</p>
            </div>
            
            <div className="w-full h-[1px] bg-gray-100"></div>
            
            <div>
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">Quantidade</p>
              <p className="text-sm font-semibold text-gray-800">{selectedRecebimento.quantidade}</p>
            </div>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <div>
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">Observações</p>
              <p className="text-sm font-semibold text-gray-800">
                {selectedRecebimento.observacoes === '--' ? 'Sem observações' : selectedRecebimento.observacoes}
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <div>
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">Responsável</p>
              <p className="text-sm font-semibold text-gray-800">{selectedRecebimento.responsavel}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-1">
          Histórico de recebimentos
        </h1>
        <p className="text-sm text-gray-500">
          Acompanhe todos os materiais recebidos no seu ponto de coleta.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          01/09/2026 - 11/09/2026
        </button>

        <div className="relative w-full sm:w-72">
          <svg className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por material..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d2a1f] focus:border-[#0d2a1f] shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 whitespace-nowrap">Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 whitespace-nowrap">Material</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 whitespace-nowrap">Quantidade</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 whitespace-nowrap">Observações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {mockRecebimentos.map((item, index) => (
              <tr 
                key={index} 
                onClick={() => setSelectedRecebimento(item)}
                className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                  {item.data}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold whitespace-nowrap">
                  {item.material}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {item.quantidade}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {item.observacoes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Receipts;