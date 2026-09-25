import React, { useState } from 'react';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Operators = () => {
  const [operators, setOperators] = useState([
    { id: 1, name: 'João Silva', email: 'joao@exemplo.com', phone: '(11) 98765-4321', status: 'Ativo' },
    { id: 2, name: 'Ana Costa', email: 'ana@exemplo.com', phone: '(11) 97654-3210', status: 'Ativo' },
    { id: 3, name: 'Carlos Almeida', email: 'carlos@exemplo.com', phone: '(11) 96543-2109', status: 'Ativo' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOperator, setNewOperator] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    op.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDeleteOperator = (id) => {
    setOperators((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddOperator = (e) => {
    e.preventDefault();
    if (!newOperator.name.trim() || !newOperator.email.trim()) return;

    const newItem = {
      id: Date.now(),
      name: newOperator.name,
      email: newOperator.email,
      phone: newOperator.phone,
      status: 'Ativo'
    };

    setOperators((prev) => [...prev, newItem]);
    setNewOperator({ name: '', email: '', phone: '', password: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0d2a1f]">Operadores do Ponto de Coleta</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie os operadores que trabalham neste ponto de coleta.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="text-base" />
          Cadastrar operador
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400">
                <th className="py-3.5 px-6 font-normal">Nome</th>
                <th className="py-3.5 px-6 font-normal">E-mail</th>
                <th className="py-3.5 px-6 font-normal">Telefone</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOperators.map((op) => (
                <tr key={op.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{op.name}</td>
                  <td className="py-4 px-6 text-gray-500">{op.email}</td>
                  <td className="py-4 px-6 text-gray-500">{op.phone}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {op.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button title="Editar" className="p-1.5 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteOperator(op.id)} title="Excluir" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOperators.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">
                    Nenhum operador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-[#0d2a1f]">Cadastrar operador</h2>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed pr-4">
                  Preencha os dados para adicionar um novo operador ao ponto de coleta.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors -mt-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOperator} className="space-y-4 mt-6">
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={newOperator.name}
                  onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@dominio.com"
                  value={newOperator.email}
                  onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-9999"
                  value={newOperator.phone}
                  onChange={(e) => setNewOperator({ ...newOperator, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  placeholder="Mínimo de 6 caracteres"
                  value={newOperator.password}
                  onChange={(e) => setNewOperator({ ...newOperator, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0d2a1f] hover:bg-[#153b2d] transition-colors shadow-sm"
                >
                  Cadastrar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Operators;