import { useEffect, useState } from 'react'
import collectionPointService from '../../../services/collectionPointService'
import userService from '../../../services/userService'

const DAYS_OF_WEEK = [
  ['MONDAY', 'Segunda-feira'],
  ['TUESDAY', 'Terça-feira'],
  ['WEDNESDAY', 'Quarta-feira'],
  ['THURSDAY', 'Quinta-feira'],
  ['FRIDAY', 'Sexta-feira'],
  ['SATURDAY', 'Sábado'],
  ['SUNDAY', 'Domingo'],
]

const toFormData = (point) => {
  const hoursByDay = new Map((point.operatingHours || []).map((hour) => [hour.dayOfWeek, hour]))
  return {
    name: point.name || '',
    street: point.address?.street || '',
    number: point.address?.number || '',
    complement: point.address?.complement || '',
    neighborhood: point.address?.neighborhood || '',
    city: point.address?.city || '',
    state: point.address?.state || '',
    country: point.address?.country || 'Brasil',
    zipCode: point.address?.zipCode || '',
    latitude: point.address?.latitude ?? point.latitude ?? '',
    longitude: point.address?.longitude ?? point.longitude ?? '',
    acceptedClothTypes: point.acceptedClothTypes || [],
    operatingHours: DAYS_OF_WEEK.map(([dayOfWeek]) => {
      const hour = hoursByDay.get(dayOfWeek)
      return {
        dayOfWeek,
        open: Boolean(hour),
        openTime: hour?.openTime || hour?.openingTime || '08:00',
        closeTime: hour?.closeTime || hour?.closingTime || '18:00',
      }
    }),
  }
}

const ManagerCollectionPoint = () => {
  const [point, setPoint] = useState(null)
  const [pointId, setPointId] = useState(null)
  const [formData, setFormData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let active = true

    const loadLinkedPoint = async () => {
      try {
        const associations = await userService.getAssociations()
        const managerPoints = associations.managerInCollectionPoints || []
        if (managerPoints.length !== 1) {
          throw new Error(managerPoints.length === 0
            ? 'Sua conta não possui um ponto de coleta vinculado.'
            : 'Há mais de um ponto vinculado a esta conta. Peça ao administrador para revisar as associações.')
        }

        const linkedPointId = managerPoints[0].id
        const linkedPoint = await collectionPointService.getRawPointById(linkedPointId)
        if (!active) return

        setPointId(linkedPointId)
        setPoint(linkedPoint)
        setFormData(toFormData(linkedPoint))
      } catch (requestError) {
        if (active) setError(requestError.message || 'Não foi possível carregar o ponto vinculado.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadLinkedPoint()
    return () => { active = false }
  }, [])

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const updateHour = (dayOfWeek, field, value) => {
    setFormData((current) => ({
      ...current,
      operatingHours: current.operatingHours.map((hour) => hour.dayOfWeek === dayOfWeek
        ? { ...hour, [field]: value }
        : hour),
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : '')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!pointId || !formData) return

    setIsSaving(true)
    setError('')
    setFeedback('')

    const address = {
      street: formData.street.trim(),
      number: formData.number.trim(),
      complement: formData.complement.trim(),
      neighborhood: formData.neighborhood.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country,
      zipCode: formData.zipCode.replace(/\D/g, ''),
      latitude: formData.latitude === '' ? undefined : Number(formData.latitude),
      longitude: formData.longitude === '' ? undefined : Number(formData.longitude),
    }
    const payload = {
      name: formData.name.trim(),
      address,
      operatingHour: formData.operatingHours
        .filter((hour) => hour.open)
        .map(({ dayOfWeek, openTime, closeTime }) => ({ dayOfWeek, openTime, closeTime })),
    }
    const multipart = new FormData()
    multipart.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (imageFile) multipart.append('image', imageFile)

    try {
      const updated = await collectionPointService.updatePoint(pointId, multipart)
      setPoint((current) => ({ ...current, ...updated }))
      setIsEditing(false)
      setImageFile(null)
      setImagePreview('')
      setFeedback(updated?.hasPendingUpdate
        ? 'Alterações enviadas para aprovação do administrador.'
        : 'Solicitação de atualização enviada com sucesso.')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível enviar as alterações.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePause = async () => {
    if (!pointId || point?.status !== 'ACTIVE') return
    setError('')
    setFeedback('')
    try {
      const updated = await collectionPointService.pausePoint(pointId)
      setPoint(updated || { ...point, status: 'PAUSED' })
      setFeedback('Recebimento pausado.')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível pausar o recebimento.')
    }
  }

  const handleCancel = () => {
    setFormData(toFormData(point))
    setImageFile(null)
    setImagePreview('')
    setIsEditing(false)
    setError('')
    setFeedback('')
  }

  if (isLoading) return <p className="p-8 text-center text-gray-500">Carregando seu ponto de coleta...</p>
  if (!point || !formData) return <p role="alert" className="p-8 text-center text-red-700">{error || 'Ponto de coleta indisponível.'}</p>

  const inputClass = 'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0d2a1f] focus:outline-none focus:ring-1 focus:ring-[#0d2a1f]'

  return (
    <section className="w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meu Ponto de Coleta</h1>
        <p className="mt-1 text-sm text-gray-500">ID vinculado: {pointId} · Status: {point.status}</p>
      </header>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {feedback && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}

      <form onSubmit={handleSave} className="space-y-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Nome do ponto
            {isEditing ? <input required name="name" value={formData.name} onChange={updateField} className={inputClass} /> : <span className="mt-1 block text-gray-900">{point.name}</span>}
          </label>
          <label className="text-sm font-medium text-gray-700">Status
            <span className="mt-1 block text-gray-900">{point.status}</span>
          </label>
        </div>

        <fieldset className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
          <legend className="text-sm font-semibold text-gray-800">Endereço</legend>
          {[
            ['street', 'Rua/Avenida'],
            ['number', 'Número'],
            ['complement', 'Complemento'],
            ['neighborhood', 'Bairro'],
            ['city', 'Cidade'],
            ['state', 'Estado'],
            ['zipCode', 'CEP'],
          ].map(([field, label]) => (
            <label key={field} className="text-sm font-medium text-gray-700">{label}
              {isEditing ? <input name={field} value={formData[field]} onChange={updateField} className={inputClass} /> : <span className="mt-1 block text-gray-900">{formData[field] || 'Não informado'}</span>}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3 border-t border-gray-100 pt-5">
          <legend className="text-sm font-semibold text-gray-800">Horários de funcionamento</legend>
          {formData.operatingHours.map((hour) => (
            <div key={hour.dayOfWeek} className={`grid items-center gap-3 text-sm ${isEditing ? 'grid-cols-[1fr_auto_auto_auto]' : 'grid-cols-[1fr_auto]'}`}>
              {DAYS_OF_WEEK.find(([day]) => day === hour.dayOfWeek)?.[1]}
              {isEditing ? (
                <>
                  <input type="time" aria-label={`Abertura ${hour.dayOfWeek}`} value={hour.openTime} disabled={!hour.open} onChange={(event) => updateHour(hour.dayOfWeek, 'openTime', event.target.value)} className="rounded-md border px-2 py-1 disabled:opacity-50" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={hour.open} onChange={(event) => updateHour(hour.dayOfWeek, 'open', event.target.checked)} />Aberto</label>
                  <input type="time" aria-label={`Fechamento ${hour.dayOfWeek}`} value={hour.closeTime} disabled={!hour.open} onChange={(event) => updateHour(hour.dayOfWeek, 'closeTime', event.target.value)} className="rounded-md border px-2 py-1 disabled:opacity-50" />
                </>
              ) : <span className="col-span-2 text-right text-gray-700">{hour.open ? `${hour.openTime}–${hour.closeTime}` : 'Fechado'}</span>}
            </div>
          ))}
        </fieldset>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-800">Tecidos aceitos</h2>
          <p className="mt-1 text-sm text-gray-700">{formData.acceptedClothTypes.join(', ') || 'Não informado'}</p>
        </div>

        {isEditing && (
          <label className="block border-t border-gray-100 pt-5 text-sm font-medium text-gray-700">Nova imagem do ponto (opcional)
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className={inputClass} />
            {imagePreview && <img src={imagePreview} alt="Prévia da nova imagem do ponto" className="mt-3 max-h-56 w-full rounded-lg border object-contain" />}
          </label>
        )}

        <footer className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          {isEditing ? (
            <>
              <button type="button" onClick={handleCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700">Cancelar</button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0d2a1f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? 'Enviando...' : 'Enviar para aprovação'}</button>
            </>
          ) : (
            <>
              {point.status === 'ACTIVE' && <button type="button" onClick={handlePause} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800">Pausar recebimento</button>}
              <button type="button" onClick={() => { setError(''); setFeedback(''); setIsEditing(true) }} className="rounded-lg bg-[#0d2a1f] px-4 py-2 text-sm font-semibold text-white">Solicitar edição</button>
            </>
          )}
        </footer>
      </form>
      <p className="mt-4 text-xs text-gray-500">As alterações enviadas pelo gerente ficam pendentes até a aprovação administrativa. A reativação do ponto não está disponível na API documentada.</p>
    </section>
  )
}

export default ManagerCollectionPoint