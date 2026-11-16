import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../../components/Header/Header'
import Footer from '../../../components/Footer/Footer'
import { useAuth } from '../../../hooks/useAuth'
import api, { getAllPages } from '../../../services/api'
import cepService from '../../../services/cepService'
import geocodingService from '../../../services/geocodingService'

const DAYS = [
  ['MONDAY', 'Segunda-feira'],
  ['TUESDAY', 'Terça-feira'],
  ['WEDNESDAY', 'Quarta-feira'],
  ['THURSDAY', 'Quinta-feira'],
  ['FRIDAY', 'Sexta-feira'],
  ['SATURDAY', 'Sábado'],
  ['SUNDAY', 'Domingo'],
]

const INITIAL = {
  name: '', street: '', number: '', complement: '', neighborhood: '',
  city: '', state: '', zipCode: '', latitude: '', longitude: '',
  openTime: '08:00', closeTime: '18:00',
}

const inputStyle = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-100'
const labelStyle = 'block text-sm font-semibold text-gray-700'

function PartnerRegistration() {
  const { user, isAuthenticated } = useAuth()
  const [form, setForm] = useState(INITIAL)
  const [days, setDays] = useState(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])
  const [clothTypes, setClothTypes] = useState([])
  const [clothTypeIds, setClothTypeIds] = useState([])
  const [image, setImage] = useState(null)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (key, value) => setForm((current) => ({
    ...current,
    [key]: value,
    ...(['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'].includes(key)
      ? { latitude: '', longitude: '' }
      : {}),
  }))

  useEffect(() => {
    let mounted = true
    getAllPages('/cloth-types')
      .then((types) => {
        if (mounted) setClothTypes(types.filter((item) => item.isActive !== false))
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Não foi possível carregar os tecidos aceitos.')
      })
      .finally(() => { if (mounted) setLoadingTypes(false) })
    return () => { mounted = false }
  }, [])

  const lookupZip = async () => {
    if (form.zipCode.replace(/\D/g, '').length !== 8) {
      setError('Informe um CEP com oito dígitos.')
      return
    }
    setError('')
    setLoadingAddress(true)
    try {
      const data = await cepService.buscarCep(form.zipCode)
      setForm((current) => ({
        ...current,
        street: data.logradouro || current.street,
        neighborhood: data.bairro || current.neighborhood,
        city: data.localidade || current.city,
        state: data.uf || current.state,
        latitude: '', longitude: '',
      }))
    } catch (e) {
      setError(e.message || 'Não foi possível consultar o CEP.')
    } finally {
      setLoadingAddress(false)
    }
  }

  const findCoordinates = async () => {
    setError('')
    setLoadingAddress(true)
    try {
      const result = await geocodingService.geocodificarEndereco({
        street: form.street, number: form.number,
        neighborhood: form.neighborhood, city: form.city,
        state: form.state, country: 'Brasil',
      })
      setForm((current) => ({ ...current,
        latitude: String(result.latitude), longitude: String(result.longitude),
      }))
    } catch (e) {
      setError(e.message || 'Localização não encontrada. Informe as coordenadas manualmente.')
    } finally {
      setLoadingAddress(false)
    }
  }

  const toggleDay = (day) => setDays((current) =>
    current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
  )
  const toggleCloth = (id) => setClothTypeIds((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!isAuthenticated) {
      setError('Entre na sua conta antes de enviar a solicitação.')
      return
    }
    if (!clothTypeIds.length || !days.length) {
      setError('Escolha ao menos um tecido e um dia de funcionamento.')
      return
    }
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    if (!form.latitude || !form.longitude || !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      setError('Informe coordenadas válidas para que o ponto apareça no mapa.')
      return
    }
    if (form.zipCode.replace(/\D/g, '').length !== 8 || !/^[A-Za-z]{2}$/.test(form.state)) {
      setError('Confira o CEP e a UF antes de enviar.')
      return
    }
    if (form.openTime >= form.closeTime) {
      setError('O horário de fechamento deve ser posterior ao de abertura.')
      return
    }
    const payload = {
      name: form.name.trim(),
      address: {
        street: form.street.trim(), number: form.number.trim(),
        complement: form.complement.trim(), neighborhood: form.neighborhood.trim(),
        city: form.city.trim(), state: form.state.trim().toUpperCase(), country: 'Brasil',
        zipCode: form.zipCode.replace(/\D/g, ''), latitude, longitude,
      },
      clothTypeIds,
      operatingHours: DAYS.filter(([day]) => days.includes(day)).map(([dayOfWeek]) => ({
        dayOfWeek, openTime: form.openTime, closeTime: form.closeTime,
      })),
    }
    const body = new FormData()
    body.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (image) body.append('image', image)

    setSaving(true)
    try {
      await api('/collection-points', { method: 'POST', body })
      setSuccess('Solicitação enviada! Seu ponto ficará pendente até a análise do administrador.')
      setForm(INITIAL)
      setClothTypeIds([])
      setDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])
      setImage(null)
    } catch (e) {
      setError(e.status === 401 ? 'Sua sessão expirou. Entre novamente.' :
        (e.data?.message || e.message || 'Não foi possível enviar sua solicitação.'))
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, required = true, type = 'text', extra = {}) => (
    <label className={labelStyle} key={key}>
      {label}{required && ' *'}
      <input
        className={inputStyle} type={type} required={required}
        value={form[key]} onChange={(e) => update(key, e.target.value)} {...extra}
      />
    </label>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7faf8] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-[#153D2C]">Seja parceiro do EcoTecidos</h1>
            <p className="mt-2 text-gray-700">Cadastre sua empresa, organização ou estabelecimento como ponto de coleta de tecidos. A solicitação será analisada antes da publicação.</p>
          </div>
          {!isAuthenticated ? (
            <section className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#153D2C]">Entre para solicitar o cadastro</h2>
              <p className="mt-2 text-gray-700">É necessário ter uma conta EcoTecidos para identificar o responsável pelo ponto.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/login" className="rounded-lg bg-green-800 px-5 py-2 font-semibold text-white">Entrar</Link>
                <Link to="/register" className="rounded-lg border border-green-800 px-5 py-2 font-semibold text-green-800">Criar conta</Link>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7 rounded-xl bg-white p-5 shadow-sm sm:p-8">
              <p className="text-sm text-gray-600">Responsável: <strong>{user?.name || user?.email || 'Conta autenticada'}</strong></p>
              <section>
                <h2 className="mb-4 text-lg font-bold text-[#153D2C]">Dados do estabelecimento</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">{field('Nome do estabelecimento', 'name')}</div>
                  {field('CEP', 'zipCode', true, 'text', { inputMode: 'numeric', maxLength: 9 })}
                  <div className="flex items-end"><button type="button" disabled={loadingAddress} onClick={lookupZip} className="w-full rounded-lg border border-green-800 px-4 py-2 font-semibold text-green-800 disabled:opacity-50">{loadingAddress ? 'Consultando...' : 'Consultar CEP'}</button></div>
                  {field('Rua ou avenida', 'street')}
                  {field('Número', 'number')}
                  {field('Complemento', 'complement', false)}
                  {field('Bairro', 'neighborhood')}
                  {field('Cidade', 'city')}
                  {field('UF', 'state', true, 'text', { maxLength: 2, placeholder: 'RS' })}
                </div>
              </section>
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#153D2C]">Localização no mapa</h2>
                <p className="mb-3 text-sm text-gray-600">Confira se o endereço está correto. A busca pode retornar uma posição aproximada; ajuste as coordenadas se necessário.</p>
                <button type="button" onClick={findCoordinates} disabled={loadingAddress || !form.street || !form.city || !form.state} className="mb-4 rounded-lg border border-green-800 px-4 py-2 font-semibold text-green-800 disabled:opacity-50">{loadingAddress ? 'Localizando...' : 'Buscar coordenadas pelo endereço'}</button>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field('Latitude', 'latitude', true, 'number', { step: 'any', min: -90, max: 90 })}
                  {field('Longitude', 'longitude', true, 'number', { step: 'any', min: -180, max: 180 })}
                </div>
              </section>
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#153D2C]">Tecidos aceitos *</h2>
                {loadingTypes && <p className="text-gray-600">Carregando tecidos...</p>}
                {!loadingTypes && clothTypes.length === 0 && <p className="text-amber-700">Nenhum tecido disponível. A equipe administradora precisa cadastrar tipos de tecido.</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {clothTypes.map((cloth) => (
                    <label key={cloth.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm">
                      <input type="checkbox" checked={clothTypeIds.includes(cloth.id)} onChange={() => toggleCloth(cloth.id)} className="accent-green-800" />
                      {cloth.name}
                    </label>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#153D2C]">Horários de funcionamento</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field('Abertura', 'openTime', true, 'time')}
                  {field('Fechamento', 'closeTime', true, 'time')}
                </div>
                <p className="mb-2 mt-4 text-sm font-semibold text-gray-700">Dias de funcionamento *</p>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {DAYS.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={days.includes(value)} onChange={() => toggleDay(value)} className="accent-green-800" />{label}
                    </label>
                  ))}
                </div>
              </section>
              <section>
                <label className={labelStyle}>Imagem do ponto (opcional)
                  <input type="file" accept="image/*" className={inputStyle} onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </label>
              </section>
              {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
              {success && <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">{success}</p>}
              <button type="submit" disabled={saving || loadingTypes || clothTypes.length === 0} className="w-full rounded-lg bg-[#153D2C] px-5 py-3 font-bold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? 'Enviando solicitação...' : 'Solicitar cadastro do ponto'}
              </button>
              <p className="text-xs text-gray-500">Ao enviar, você solicita a avaliação do ponto. Ele só aparecerá na busca pública após aprovação.</p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PartnerRegistration
