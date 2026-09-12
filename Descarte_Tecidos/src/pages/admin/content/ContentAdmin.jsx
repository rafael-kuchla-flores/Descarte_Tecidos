import React, { useState } from 'react'
import { 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiCloseLine, 
  RiAttachment2,
  RiBold,
  RiItalic,
  RiUnderline,
  RiLink,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiListUnordered
} from 'react-icons/ri'

const ContentAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [conteudos, setConteudos] = useState([
    {
      id: 1,
      titulo: 'O impacto da indústria têxtil no meio ambiente',
      categoria: 'Sustentabilidade',
      status: 'Publicado',
      data: '16/05/2026'
    },
    {
      id: 2,
      titulo: '5 dicas para reutilizar suas roupas',
      categoria: 'Dicas',
      status: 'Publicado',
      data: '10/05/2026'
    },
    {
      id: 3,
      titulo: 'O que é economia circular?',
      categoria: 'Economia Circular',
      status: 'Publicado',
      data: '14/05/2026'
    },
    {
      id: 4,
      titulo: 'Materiais têxteis sustentáveis',
      categoria: 'Sustentabilidade',
      status: 'Rascunho',
      data: '12/05/2026'
    }
  ])

  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    imagem: null,
    conteudo: '',
    status: 'Publicado'
  })

  const filteredConteudos = conteudos.filter(item =>
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNovoConteudo = () => {
    setEditingId(null)
    setFormData({ titulo: '', categoria: '', imagem: null, conteudo: '', status: 'Publicado' })
    setIsModalOpen(true)
  }

  const handleEditar = (item) => {
    setEditingId(item.id)
    setFormData({
      titulo: item.titulo,
      categoria: item.categoria,
      imagem: null,
      conteudo: 'Conteúdo simulado do banco de dados...', 
      status: item.status
    })
    setIsModalOpen(true)
  }

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setConteudos(conteudos.filter(item => item.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const hoje = new Date()
    const dataAtual = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`

    if (editingId) {
      setConteudos(conteudos.map(c => 
        c.id === editingId 
        ? { ...c, titulo: formData.titulo, categoria: formData.categoria, status: formData.status } 
        : c
      ))
    } else {
      const novoConteudo = {
        id: Math.random(),
        titulo: formData.titulo,
        categoria: formData.categoria,
        status: formData.status,
        data: dataAtual
      }
      setConteudos([novoConteudo, ...conteudos])
    }

    setIsModalOpen(false)
  }

  return (
    <div className="w-full bg-white p-8 min-h-[calc(100vh-70px)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Conteúdos</h1>
        <button
          onClick={handleNovoConteudo}
          className="bg-[#123C2C] hover:bg-[#1a5640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          + Novo conteúdo
        </button>
      </div>

      <div className="mb-6 w-full max-w-sm">
        <input
          type="text"
          placeholder="Buscar conteúdo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#123C2C]"
        />
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-100 bg-white text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 w-24">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredConteudos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Nenhum conteúdo encontrado.</td>
              </tr>
            ) : (
              filteredConteudos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.titulo}</td>
                  <td className="px-6 py-4">{item.categoria}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Publicado' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.data}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-lg">
                      <button onClick={() => handleEditar(item)} className="text-orange-500 hover:text-orange-700 transition-colors cursor-pointer" title="Editar">
                        <RiPencilLine />
                      </button>
                      <button onClick={() => handleExcluir(item.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" title="Excluir">
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 bg-white">
          Mostrando 1 a {filteredConteudos.length} de {conteudos.length} conteúdos
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Editar conteúdo' : 'Novo conteúdo'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">
                <RiCloseLine />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="form-conteudo" onSubmit={handleSubmit} className="space-y-5 text-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Título*</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: O impacto da indústria têxtil..."
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Categoria*</label>
                    <select
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-[#123C2C] text-gray-700"
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      <option value="Sustentabilidade">Sustentabilidade</option>
                      <option value="Dicas">Dicas</option>
                      <option value="Economia Circular">Economia Circular</option>
                      <option value="Moda Consciente">Moda Consciente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Imagem de destaque</label>
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
                  {formData.imagem && <p className="text-xs text-emerald-600 mt-1">Arquivo selecionado: {formData.imagem.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Conteúdo*</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#123C2C] transition-colors">

                    <div className="bg-gray-50 border-b border-gray-200 flex items-center px-3 py-2 gap-3 text-gray-500 text-lg">
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiBold /></button>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiItalic /></button>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiUnderline /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiLink /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiAlignLeft /></button>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiAlignCenter /></button>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiAlignRight /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" className="hover:text-gray-800 transition-colors cursor-pointer"><RiListUnordered /></button>
                    </div>

                    <textarea
                      required
                      rows="5"
                      placeholder="Escreva o conteúdo aqui..."
                      value={formData.conteudo}
                      onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                      className="w-full p-4 focus:outline-none resize-none text-gray-700"
                    ></textarea>
                  </div>
                </div>

   
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status*</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-[#123C2C] text-gray-700"
                  >
                    <option value="Publicado">Publicado</option>
                    <option value="Rascunho">Rascunho</option>
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
                form="form-conteudo"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#123C2C] rounded-lg hover:bg-[#1a5640] transition-colors cursor-pointer"
              >
                {editingId ? 'Salvar alterações' : 'Publicar'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ContentAdmin