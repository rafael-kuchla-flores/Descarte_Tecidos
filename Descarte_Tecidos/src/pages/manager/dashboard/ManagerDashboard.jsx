import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth'; 

const ManagerDashboard = () => {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(true);
  const [pontoInfo, setPontoInfo] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [recebimentos, setRecebimentos] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {   
        setPontoInfo({
          nome: 'Ponto de Coleta Centro',
          endereco: 'Rua das Flores, 123 - Centro, São Paulo/SP',
          status: 'ATIVO'
        });

        setMetricas({
          totalRecebimentos: 124,
          crescimentoRecebimentos: '+ 12%',
          operadores: 3,
          crescimentoOperadores: '+ 1',
          tiposTecido: 5,
          crescimentoTecido: '+ 1'
        });

        setRecebimentos([
          { id: 1, data: '11/09/2026', material: 'Algodão', quantidade: '10 kg', responsavel: 'João Silva' },
          { id: 2, data: '10/09/2026', material: 'Jeans', quantidade: '8 kg', responsavel: 'Ana Costa' },
          { id: 3, data: '09/09/2026', material: 'Poliéster', quantidade: '15 kg', responsavel: 'Carlos Almeida' },
          { id: 4, data: '08/09/2026', material: 'Algodão', quantidade: '5 kg', responsavel: 'João Silva' },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchDashboardData();
  }, [user]);


  if (isLoading || !pontoInfo) {
    return <div className="w-full min-h-screen p-8 text-gray-500 text-center">Carregando painel...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white p-8 font-sans">
      
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Acompanhe o desempenho do seu ponto de coleta.
        </p>
      </div>

      <div className="max-w-5xl">
        
       
        <div className="flex items-center justify-between p-4 mb-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full text-xl">
              📍
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                {pontoInfo.nome}
              </h2>
              <p className="text-[13px] text-gray-400 mt-0.5">
                {pontoInfo.endereco}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${pontoInfo.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {pontoInfo.status}
          </span>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div className="text-xl mb-3">📦</div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">{metricas.totalRecebimentos}</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Total de recebimentos</p>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-3">
              {metricas.crescimentoRecebimentos}
            </p>
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div className="text-xl mb-3">👷</div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">{metricas.operadores}</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Operadores</p>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-3">
              {metricas.crescimentoOperadores}
            </p>
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div className="text-xl mb-3">🧵</div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">{metricas.tiposTecido}</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Tipos de tecido</p>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-3">
              {metricas.crescimentoTecido}
            </p>
          </div>
        </div>

        
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-[15px] font-bold text-gray-900">
              Recebimentos recentes
            </h3>
            <button className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Ver todos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-400 w-1/4">Data</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-400 w-1/4">Material</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-400 w-1/4">Quantidade</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-400 w-1/4">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recebimentos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.data}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {item.material}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.quantidade}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.responsavel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;