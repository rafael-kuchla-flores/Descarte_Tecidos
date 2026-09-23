import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const AcceptedFabrics = () => {
  const [fabrics, setFabrics] = useState([
    { id: 1, name: 'Algodão', description: 'Roupas e tecidos de algodão', status: 'Ativo' },
    { id: 2, name: 'Jeans', description: 'Calças, jaquetas, shorts', status: 'Ativo' },
    { id: 3, name: 'Poliéster', description: 'Roupas e tecidos sintéticos', status: 'Ativo' },
    { id: 4, name: 'Linho', description: 'Roupas e tecidos de linho', status: 'Ativo' },
    { id: 5, name: 'Viscose', description: 'Tecidos leves e fluidos', status: 'Ativo' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFabric, setNewFabric] = useState({
    name: '',
    description: ''
  });

  const handleDeleteFabric = (id) => {
    setFabrics((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddFabric = (e) => {
    e.preventDefault();
    if (!newFabric.name.trim()) return;

    const newItem = {
      id: Date.now(),
      name: newFabric.name,
      description: newFabric.description || 'Sem descrição',
      status: 'Ativo'
    };

    setFabrics((prev) => [...prev, newItem]);
    setNewFabric({ name: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0d2a1f]">Tipos de Tecidos Aceitos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Selecione os tipos de tecidos que seu ponto de coleta aceita.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="text-base" />
          Adicionar tipo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400">
                <th className="py-3.5 px-6 font-normal">Tipo de tecido</th>
                <th className="py-3.5 px-6 font-normal">Descrição</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {fabrics.map((fabric) => (
                <tr key={fabric.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-base flex-shrink-0">
                        🧵
                      </div>
                      <span className="font-bold text-gray-900">{fabric.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {fabric.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {fabric.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteFabric(fabric.id)}
                      title="Excluir tecido"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {fabrics.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 text-sm">
                    Nenhum tipo de tecido cadastrado.
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0d2a1f]">Adicionar tipo</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFabric} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de tecido<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Seda"
                  value={newFabric.name}
                  onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tecidos finos e delicados"
                  value={newFabric.description}
                  onChange={(e) => setNewFabric({ ...newFabric, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0d2a1f] hover:bg-[#153b2d] transition-colors shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AcceptedFabrics;