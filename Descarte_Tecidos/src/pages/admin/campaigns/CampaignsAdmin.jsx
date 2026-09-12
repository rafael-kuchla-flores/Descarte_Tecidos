import React, { useState } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiCloseLine, RiAttachment2 } from 'react-icons/ri'

const CampaignsAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [campanhas, setCampanhas] = useState([
    {
      id: 1,
      titulo: 'Campanha do Agasalho 2026',
      dataInicio: '01/06/2026',
      dataFinal: '30/08/2026',
      status: 'Ativa',
      imagem: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      titulo: 'Doe e Recicle',
      dataInicio: '15/03/2026',
      dataFinal: '15/06/2026',
      status: 'Ativa',
      imagem: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      titulo: 'Tecidos que Transformam',
      dataInicio: '01/01/2026',
      dataFinal: '10/04/2026',
      status: 'Encerrada',
      imagem: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      titulo: 'Descarte Consciente',
      dataInicio: '05/11/2025',
      dataFinal: '28/02/2026',
      status: 'Encerrada',
      imagem: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&w=800&q=80'
    }
  ])

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFinal: '',
    status: 'Ativa',
    imagem: null
  })

  const filteredCampanhas = campanhas.filter(campanha =>
    campanha.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNovaCampanha = () => {
    setEditingId(null)
    setFormData({ nome: '', descricao: '', dataInicio: '', dataFinal: '', status: 'Ativa', imagem: null })
    setIsModalOpen(true)
  }

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      // Quando tiver API: await api.delete(`/campanhas/${id}`)
      setCampanhas(campanhas.filter(campanha => campanha.id !== id))
    }
  }

  const handleEditar = (campanha) => {
    setEditingId(campanha.id)
    setFormData({
      nome: campanha.titulo,
      descricao: 'Descrição simulada do banco de dados...', 
      dataInicio: campanha.dataInicio.split('/').reverse().join('-'),
      dataFinal: campanha.dataFinal.split('/').reverse().join('-'),
      status: campanha.status,
      imagem: null
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      setCampanhas(campanhas.map(c => 
        c.id === editingId 
        ? { 
            ...c, 
            titulo: formData.nome, 
            status: formData.status,
            dataInicio: formData.dataInicio.split('-').reverse().join('/'),
            dataFinal: formData.dataFinal.split('-').reverse().join('/')
          } 
        : c
      ))
    } else {
      const novaCampanha = {
        id: Math.random(), 
        titulo: formData.nome,
        dataInicio: formData.dataInicio.split('-').reverse().join('/'),
        dataFinal: formData.dataFinal.split('-').reverse().join('/'),
        status: formData.status,
        imagem: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'
      }
      setCampanhas([novaCampanha, ...campanhas])
    }

    setIsModalOpen(false)
    setEditingId(null)
    setFormData({ nome: '', descricao: '', dataInicio: '', dataFinal: '', status: 'Ativa', imagem: null })
  }

  return (
    <div className="w-full bg-white p-8 min-h-[calc(100vh-70px)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">CampaignsAdmin</h1>
        <button
          onClick={handleNovaCampanha}
          className="bg-[#123C2C] hover:bg-[#1a5640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          + Nova campanha
        </button>
      </div>

      <div className="mb-8 w-full max-w-sm">
        <input
          type="text"
          placeholder="Buscar campanha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#123C2C]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampanhas.map((campanha) => (
          <div key={campanha.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col shadow-sm">

            <div className="h-48 w-full overflow-hidden bg-gray-100">
              <img 
                src={campanha.imagem} 
                alt={campanha.titulo} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                <span>{campanha.dataInicio} a {campanha.dataFinal}</span>
                <span className={`px-2.5 py-1 rounded-md font-semibold ${
                  campanha.status === 'Ativa' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {campanha.status}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mt-1">{campanha.titulo}</h3>
              
              <div className="flex gap-4 text-sm mt-3 font-medium">
                <button 
                  onClick={() => handleEditar(campanha)}
                  className="flex items-center gap-1.5 text-orange-500 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  <RiPencilLine className="text-lg" /> Editar
                </button>
                <button 
                  onClick={() => handleExcluir(campanha.id)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RiDeleteBinLine className="text-lg" /> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCampanhas.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-10 text-gray-500">
            Nenhuma campanha encontrada.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Editar campanha' : 'Nova campanha'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
              >
                <RiCloseLine />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="form-campanha" onSubmit={handleSubmit} className="space-y-4 text-sm">
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nome da campanha*</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Campanha do Agasalho 2026"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Descrição*</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Descreva o objetivo da campanha..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C] resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Data início*</label>
                    <input
                      type="date"
                      required
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C] text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Data final*</label>
                    <input
                      type="date"
                      required
                      value={formData.dataFinal}
                      onChange={(e) => setFormData({...formData, dataFinal: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C] text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Imagem da campanha*</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <RiAttachment2 className="text-sm" /> Clique para enviar ou arraste a imagem
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">PNG, JPG até 5MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg"
                      onChange={(e) => setFormData({...formData, imagem: e.target.files[0]})}
                    />
                  </label>
                  {formData.imagem && <p className="text-xs text-emerald-600 mt-1">Arquivo: {formData.imagem.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status*</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-[#123C2C] text-gray-700 cursor-pointer"
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div>

              </form>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-campanha"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#123C2C] rounded-lg hover:bg-[#1a5640] transition-colors cursor-pointer"
              >
                {editingId ? 'Salvar alterações' : 'Criar campanha'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignsAdmin