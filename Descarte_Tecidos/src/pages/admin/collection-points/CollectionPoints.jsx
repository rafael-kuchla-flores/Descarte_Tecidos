import React, { useState, useEffect } from 'react'
import { 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiCloseLine, 
  RiPauseCircleLine, 
  RiPlayCircleLine 
} from 'react-icons/ri'
import pointService from '../../../services/pointsService' 

const CollectionPoints = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [pontos, setPontos] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    horario: '',
    materiais: '',
    bairro: '',
    cidade: ''
  })


  const fetchPontos = async () => {
    try {
      setLoading(true)
      const data = await pointService.getPontos()
   
      setPontos(Array.isArray(data) ? data : data?.content || [])
    } catch (error) {
      console.error("Erro ao carregar pontos:", error)
      alert("Erro ao carregar a lista de pontos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPontos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      await pointService.createPonto(formData)
      
      setIsModalOpen(false)
      setFormData({ nome: '', endereco: '', horario: '', materiais: '', bairro: '', cidade: '' }) 
      fetchPontos() 
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert(error.data?.message || "Erro ao salvar o ponto de coleta.")
    }
  }


  const handleTogglePause = async (id, statusAtual) => {
    const acao = statusAtual === 'ATIVO' ? 'pausar' : 'reativar'
    if (window.confirm(`Deseja ${acao} o recebimento deste ponto?`)) {
      try {
        const novoStatus = statusAtual === 'ATIVO' ? 'PAUSADO' : 'ATIVO'
        await pointService.toggleStatus(id, novoStatus)
        fetchPontos()
      } catch (error) {
        console.error("Erro ao alterar status:", error)
        alert("Erro ao alterar o status.")
      }
    }
  }

  const filteredPontos = pontos.filter(ponto =>
    (ponto.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )


  return (
    <div className="w-full bg-white p-8 min-h-[calc(100vh-70px)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pontos de coleta</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#123C2C] hover:bg-[#1a5640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          + Adicionar ponto
        </button>
      </div>

      <div className="mb-6 w-full max-w-sm">
        <input
          type="text"
          placeholder="Buscar ponto de coleta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#123C2C]"
        />
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-100 bg-white text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Cidade</th>
              <th className="px-6 py-4">Horário</th>
              <th className="px-6 py-4">Status</th> 
              <th className="px-6 py-4 w-32">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredPontos.map((ponto) => (
              <tr key={ponto.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-800">{ponto.nome}</td>
                <td className="px-6 py-4">{ponto.cidade}</td>
                <td className="px-6 py-4">{ponto.horario}</td>
                
             
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    ponto.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {ponto.status === 'ATIVO' ? 'Recebendo' : 'Pausado'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-lg">
                    
                  
                    <button 
                      onClick={() => handleTogglePause(ponto.id)}
                      className={`${ponto.status === 'ATIVO' ? 'text-amber-500 hover:text-amber-700' : 'text-emerald-500 hover:text-emerald-700'} transition-colors cursor-pointer`}
                      title={ponto.status === 'ATIVO' ? 'Pausar recebimento' : 'Reativar recebimento'}
                    >
                      {ponto.status === 'ATIVO' ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
                    </button>

                    <button className="text-orange-500 hover:text-orange-700 transition-colors cursor-pointer" title="Editar">
                      <RiPencilLine />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" title="Excluir">
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 bg-white">
          Mostrando 1 a {filteredPontos.length} de {pontos.length} pontos
        </div>
      </div>

    
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Adicionar ponto de coleta</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">
                <RiCloseLine />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="form-ponto" onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nome*</label>
                  <input type="text" required placeholder="Ex: ONG Mãos Solidárias" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Endereço*</label>
                  <input type="text" required placeholder="Rua, Avenida, Travessa..." value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Horário de funcionamento*</label>
                  <input type="text" required placeholder="Ex: Seg a Sex, 08h às 18h" value={formData.horario} onChange={(e) => setFormData({...formData, horario: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Materiais aceitos*</label>
                  <input type="text" required placeholder="Ex: Roupas, lençóis, calçados..." value={formData.materiais} onChange={(e) => setFormData({...formData, materiais: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cidade*</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="Bairro" value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                    <select required value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-[#123C2C] text-gray-600">
                      <option value="" disabled>Selecione a cidade</option>
                      <option value="Recife - PE">Recife - PE</option>
                      <option value="Jaboatão dos Guararapes - PE">Jaboatão dos Guararapes - PE</option>
                      <option value="Olinda - PE">Olinda - PE</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl bg-white">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit" form="form-ponto" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#123C2C] rounded-lg hover:bg-[#1a5640] transition-colors cursor-pointer">
                Salvar ponto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionPoints