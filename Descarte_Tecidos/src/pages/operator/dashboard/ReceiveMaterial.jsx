import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceiveMaterial = () => {
  const navigate = useNavigate();
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoMaterial || !quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const novoRecebimento = {
        tipoMaterial,
        quantidade: Number(quantidade),
        observacoes,
        data: new Date().toISOString(),
      };

      console.log('Enviando dados do recebimento:', novoRecebimento);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Recebimento registrado com sucesso!');
      navigate('/operator/dashboard');
    } catch (error) {
      console.error('Erro ao registrar recebimento:', error);
      alert('Ocorreu um erro ao registrar o recebimento.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    navigate('/operator/dashboard');
  };

  return (
    <div className="w-full max-w-xl font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Receber material
        </h1>
        <p className="text-sm text-gray-500">
          Registre um novo recebimento de materiais.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Tipo de material <span className="text-gray-900">*</span>
          </label>
          <div className="relative">
            <select
              value={tipoMaterial}
              onChange={(e) => setTipoMaterial(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f] cursor-pointer appearance-none pr-8"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23374151\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1em',
              }}
            >
              <option value="" disabled>
                Selecione o tipo de material
              </option>
              <option value="algodao">Algodão</option>
              <option value="jeans">Jeans</option>
              <option value="poliester">Poliéster</option>
              <option value="linho">Linho</option>
              <option value="viscose">Viscose</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Quantidade <span className="text-gray-900">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.1"
              step="any"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 10"
              required
              className="w-full px-3.5 py-2.5 pr-12 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium select-none">
              kg
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Observações (opcional)
          </label>
          <textarea
            rows="4"
            maxLength={300}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Informações adicionais..."
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f] resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-gray-300 font-medium">
              {observacoes.length}/300
            </span>
          </div>
        </div>


        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0d2a1f] hover:bg-[#153b2d] transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar recebimento'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ReceiveMaterial;