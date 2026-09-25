import React from 'react';
import { FiCalendar, FiArrowUp, FiMoreVertical } from 'react-icons/fi';

const Receipts = () => {
  const receiptsData = [
    { id: 1, date: '11/09/2026', material: 'Algodão', quantity: '10 kg', responsible: 'João Silva' },
    { id: 2, date: '10/09/2026', material: 'Jeans', quantity: '8 kg', responsible: 'Ana Costa' },
    { id: 3, date: '09/09/2026', material: 'Poliéster', quantity: '15 kg', responsible: 'Carlos Almeida' },
    { id: 4, date: '08/09/2026', material: 'Algodão', quantity: '5 kg', responsible: 'João Silva' },
    { id: 5, date: '07/09/2026', material: 'Viscose', quantity: '7 kg', responsible: 'Ana Costa' },
    { id: 6, date: '06/09/2026', material: 'Linho', quantity: '8 kg', responsible: 'Carlos Almeida' },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0d2a1f]">Recebimentos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Acompanhe todos os recebimentos do seu ponto de coleta.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <FiCalendar className="text-blue-500" />
            01/09/2026 - 11/09/2026
          </button>
          
          <button className="inline-flex items-center justify-center gap-2 bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <FiArrowUp className="text-base" />
            Exportar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xl mb-2">📦</div>
          <div className="text-2xl font-bold text-gray-900">124</div>
          <div className="text-sm text-gray-500 mt-1">Total de recebimentos</div>
          <div className="text-xs font-medium text-emerald-500 mt-1">+ 12%</div>
        </div>
=
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xl mb-2">🧵</div>
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-500 mt-1">Total de materiais</div>
          <div className="text-xs font-medium text-emerald-500 mt-1">+ 8%</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xl mb-2">⚖️</div>
          <div className="text-2xl font-bold text-gray-900">53 kg</div>
          <div className="text-sm text-gray-500 mt-1">Peso total</div>
          <div className="text-xs font-medium text-emerald-500 mt-1">+ 8%</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400">
                <th className="py-4 px-6 font-normal">Data</th>
                <th className="py-4 px-6 font-normal">Material</th>
                <th className="py-4 px-6 font-normal">Quantidade</th>
                <th className="py-4 px-6 font-normal">Responsável</th>
                <th className="py-4 px-6 font-normal text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {receiptsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-600">{item.date}</td>
                  <td className="py-4 px-6 font-medium text-gray-900">{item.material}</td>
                  <td className="py-4 px-6 text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-6 text-gray-600">{item.responsible}</td>
                  <td className="py-4 px-6 text-right">
                    <button title="Opções" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Receipts;