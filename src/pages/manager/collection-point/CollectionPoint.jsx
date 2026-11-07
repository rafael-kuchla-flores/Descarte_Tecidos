import { useEffect, useState } from 'react'
import { RiPauseCircleLine, RiPlayCircleLine } from 'react-icons/ri'
import managerService from '../../../services/managerService'

const statusLabel = (status) => ({
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  PENDING: 'Pendente',
}[status] || status || 'Ativo')

const toForm = (point) => ({
  id: point.id,
  nome: point.name || '',
  endereco: typeof point.address === 'string'
    ? point.address
    : [point.address?.street, point.address?.number, point.address?.complement, point.address?.neighborhood, point.address?.city, point.address?.state].filter(Boolean).join(', '),
  city: point.city || '',
  latitude: point.latitude ?? '',
  longitude: point.longitude ?? '',
  horario: (point.operatingHours || []).map((item) => `${item.dayOfWeek}: ${item.openTime || item.openingTime} às ${item.closeTime || item.closingTime}`).join(' • '),
  operatingHours: point.operatingHours || [],
  materiais: (point.acceptedClothTypes || []).join(', '),
  telefone: point.phone || '',
  email: point.email || '',
  descricao: point.description || '',
  foto: point.pointPictureUrl || '',
  status: statusLabel(point.status),
})

const ManagerCollectionPoint = () => {
  const [formData, setFormData] = useState(null)
  const [originalFormData, setOriginalFormData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let mounted = true
    managerService.getManagerCollectionPoint()
      .then((point) => {
        if (!mounted) return
        const mapped = toForm(point)
        setFormData(mapped)
        setOriginalFormData(mapped)
      })
      .catch((error) => mounted && setFeedback(error.message || 'Não foi possível carregar o ponto.'))
      .finally(() => mounted && setIsLoading(false))

    return () => { mounted = false }
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback('')
    const addressChanged = formData.endereco !== originalFormData.endereco
      || String(formData.latitude) !== String(originalFormData.latitude)
      || String(formData.longitude) !== String(originalFormData.longitude)

    try {
      const times = formData.horario.match(/(\d{2}:\d{2}).*?(\d{2}:\d{2})/)
      const operatingHours = formData.horario === originalFormData.horario
        ? formData.operatingHours
        : times
          ? [{ dayOfWeek: formData.horario.split(':')[0] || 'MONDAY', openTime: times[1], closeTime: times[2] }]
          : formData.operatingHours
      const updated = await managerService.updateManagerCollectionPoint({
        name: formData.nome,
        address: formData.endereco,
        city: formData.city,
        latitude: formData.latitude === '' ? null : Number(formData.latitude),
        longitude: formData.longitude === '' ? null : Number(formData.longitude),
        phone: formData.telefone,
        email: formData.email,
        description: formData.descricao,
        imageUrl: formData.foto,
        acceptedClothTypes: formData.materiais.split(',').map((item) => item.trim()).filter(Boolean),
        operatingHours,
      })
      const mapped = toForm(updated)
      setFormData(mapped)
      setOriginalFormData(mapped)
      setIsEditing(false)
      setFeedback(addressChanged ? 'Endereço atualizado; o ponto voltou para aprovação.' : 'Alterações salvas no servidor.')
    } catch (error) {
      setFeedback(error.message || 'Não foi possível salvar as alterações.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleReceiving = async () => {
    if (formData.status === 'Pendente') {
      setFeedback('O recebimento poderá ser alterado após a aprovação do administrador.')
      return
    }

    try {
      const response = await managerService.updateManagerCollectionPointStatus(formData.status === 'Pausado' ? 'ACTIVE' : 'PAUSED')
      const mapped = toForm(response.point)
      setFormData(mapped)
      setOriginalFormData(mapped)
      setFeedback('Status atualizado no servidor.')
    } catch (error) {
      setFeedback(error.message || 'Não foi possível alterar o status do ponto.')
    }
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFormData((current) => ({ ...current, foto: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  const useLocation = () => {
    if (!navigator.geolocation) {
      setFeedback('A geolocalização não está disponível neste navegador.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setFormData((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude })),
      () => setFeedback('Não foi possível obter sua localização.'),
    )
  }

  if (isLoading) return <p className="p-8 text-center text-gray-500">Carregando ponto de coleta...</p>
  if (!formData) return <p role="alert" className="p-8 text-center text-red-700">{feedback || 'Ponto não encontrado para este gerente.'}</p>

  const inputClass = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0d2a1f] focus:outline-none focus:ring-1 focus:ring-[#0d2a1f]'
  const addressChanged = isEditing && (
    formData.endereco !== originalFormData.endereco
    || String(formData.latitude) !== String(originalFormData.latitude)
    || String(formData.longitude) !== String(originalFormData.longitude)
  )

  return (
    <form onSubmit={handleSave} className="w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Informações do Ponto de Coleta</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie as informações do seu ponto de coleta.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <img src={formData.foto || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80'} alt="Foto do ponto de coleta" className="h-[72px] w-[72px] shrink-0 rounded-lg border border-gray-100 object-cover" />
            <div className="w-full max-w-md space-y-2">
              {isEditing ? <>
                <input aria-label="Nome do ponto" name="nome" value={formData.nome} onChange={updateField} className={inputClass} required />
                <input aria-label="Endereço" name="endereco" value={formData.endereco} onChange={updateField} className={inputClass} />
              </> : <>
                <h2 className="text-lg font-bold text-[#0d2a1f]">{formData.nome}</h2>
                <p className="text-sm text-gray-500">{formData.endereco}</p>
              </>}
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold">{formData.status}</span>
        </div>

        <div className="my-6 grid grid-cols-1 gap-5 border-y border-gray-100 py-6 md:grid-cols-3">
          {[
            ['horario', 'Horário de funcionamento'],
            ['telefone', 'Telefone'],
            ['email', 'E-mail'],
          ].map(([field, label]) => <label key={field} className="text-sm text-gray-500">
            {label}
            {isEditing ? <input name={field} type={field === 'email' ? 'email' : 'text'} value={formData[field]} onChange={updateField} className={`${inputClass} mt-1`} /> : <span className="mt-1 block font-medium text-gray-800">{formData[field] || 'Não informado'}</span>}
          </label>)}
        </div>

        <label className="block text-sm text-gray-500">Descrição
          {isEditing ? <textarea name="descricao" value={formData.descricao} onChange={updateField} rows="3" className={`${inputClass} mt-1`} /> : <span className="mt-1 block leading-relaxed text-gray-700">{formData.descricao || 'Sem descrição.'}</span>}
        </label>

        {isEditing && <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="text-sm text-gray-500">Tipos de tecido aceitos<input name="materiais" value={formData.materiais} onChange={updateField} className={`${inputClass} mt-1`} /></label>
          <label className="text-sm text-gray-500">Foto do ponto<input type="file" accept="image/*" onChange={handlePhotoChange} className={`${inputClass} mt-1`} /></label>
          <div className="md:col-span-2">
            <button type="button" onClick={useLocation} className="text-xs font-semibold text-[#0d2a1f] hover:underline">Usar minha localização</button>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input aria-label="Latitude" name="latitude" value={formData.latitude} onChange={updateField} placeholder="Latitude" className={inputClass} />
              <input aria-label="Longitude" name="longitude" value={formData.longitude} onChange={updateField} placeholder="Longitude" className={inputClass} />
            </div>
          </div>
        </div>}

        {addressChanged && <p className="mt-5 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">Alterações no endereço ou localização exigem nova aprovação do administrador.</p>}
        {feedback && <p role="status" className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">{feedback}</p>}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          {isEditing ? <>
            <button type="button" onClick={() => { setFormData(originalFormData); setIsEditing(false) }} className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700">Cancelar</button>
            <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0d2a1f] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{isSaving ? 'Salvando...' : 'Salvar alterações'}</button>
          </> : <>
            <button type="button" onClick={toggleReceiving} disabled={formData.status === 'Pendente'} className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300">
              {formData.status === 'Pausado' ? <RiPlayCircleLine /> : <RiPauseCircleLine />}{formData.status === 'Pausado' ? 'Reativar recebimento' : 'Pausar recebimento'}
            </button>
            <button type="button" onClick={() => { setFeedback(''); setIsEditing(true) }} className="rounded-lg bg-[#0d2a1f] px-5 py-2.5 text-sm font-medium text-white">Editar informações</button>
          </>}
        </div>
      </div>
    </form>
  )
}

export default ManagerCollectionPoint
