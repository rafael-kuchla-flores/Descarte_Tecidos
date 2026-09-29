import { useEffect, useState } from 'react'
import { RiAddLine, RiCheckLine, RiCloseLine, RiPencilLine } from 'react-icons/ri'
import pointService from '../../../services/pointsService'

const emptyForm = { name: '', description: '' }

const ClothTypes = () => {
  const [clothTypes, setClothTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadClothTypes = async () => {
    try {
      setClothTypes(await pointService.getClothTypes())
      setError('')
    } catch (requestError) {
      console.error('Erro ao carregar tipos de tecido:', requestError)
      setError(requestError.data?.message || 'Não foi possível carregar os tipos de tecido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    pointService.getClothTypes()
      .then((types) => {
        if (!active) return
        setClothTypes(types)
        setError('')
      })
      .catch((requestError) => {
        if (!active) return
        console.error('Erro ao carregar tipos de tecido:', requestError)
        setError(requestError.data?.message || 'Não foi possível carregar os tipos de tecido.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (clothType) => {
    setEditingId(clothType.id)
    setFormData({ name: clothType.name, description: clothType.description || '' })
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(emptyForm)
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSaving(true)

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      }

      if (editingId) {
        await pointService.updateClothType(editingId, payload)
      } else {
        await pointService.createClothType(payload)
      }

      closeModal()
      await loadClothTypes()
    } catch (requestError) {
      console.error('Erro ao salvar tipo de tecido:', requestError)
      setFormError(requestError.data?.message || 'Não foi possível salvar o tipo de tecido.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (clothType) => {
    try {
      await pointService.updateClothType(clothType.id, {
        name: clothType.name,
        description: clothType.description || '',
        isActive: !clothType.isActive,
      })
      await loadClothTypes()
    } catch (requestError) {
      console.error('Erro ao atualizar tipo de tecido:', requestError)
      setError(requestError.data?.message || 'Não foi possível atualizar o tipo de tecido.')
    }
  }

  return (
    <section className="w-full bg-white p-6 sm:p-8 min-h-[calc(100vh-70px)]">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tipos de tecido</h1>
          <p className="mt-1 text-sm text-gray-500">Cadastre os materiais disponíveis para os pontos de coleta.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a5640]"
        >
          <RiAddLine className="text-lg" />
          Adicionar tipo
        </button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Carregando tipos de tecido...</td></tr>
              ) : clothTypes.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Nenhum tipo cadastrado.</td></tr>
              ) : clothTypes.map((clothType) => (
                <tr key={clothType.id}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{clothType.name}</td>
                  <td className="px-6 py-4">{clothType.description}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${clothType.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {clothType.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => openEditModal(clothType)} title="Editar tipo" className="text-orange-500 transition-colors hover:text-orange-700">
                        <RiPencilLine className="text-lg" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(clothType)}
                        title={clothType.isActive ? 'Desativar tipo' : 'Ativar tipo'}
                        className={`transition-colors ${clothType.isActive ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'}`}
                      >
                        {clothType.isActive ? <RiCloseLine className="text-lg" /> : <RiCheckLine className="text-lg" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="cloth-type-title" className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 id="cloth-type-title" className="text-lg font-bold text-gray-900">{editingId ? 'Editar tipo de tecido' : 'Adicionar tipo de tecido'}</h2>
              <button type="button" onClick={closeModal} aria-label="Fechar" className="text-xl text-gray-500 hover:text-gray-800">
                <RiCloseLine />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
              <label className="block text-sm font-semibold text-gray-700">
                Nome*
                <input
                  required
                  minLength={2}
                  maxLength={30}
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 font-normal focus:border-[#123C2C] focus:outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Descrição*
                <textarea
                  required
                  maxLength={255}
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="mt-1 w-full resize-y rounded-lg border border-gray-200 px-4 py-2.5 font-normal focus:border-[#123C2C] focus:outline-none"
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeModal} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a5640] disabled:opacity-60">
                  {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar tipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ClothTypes