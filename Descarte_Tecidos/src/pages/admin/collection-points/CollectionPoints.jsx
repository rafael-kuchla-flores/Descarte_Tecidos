import { useState, useEffect } from 'react'
import {
  RiPencilLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiCheckLine,
  RiFilterLine
} from 'react-icons/ri'
import pointService from '../../../services/pointsService'
import cepService from '../../../services/cepService'
import geocodingService from '../../../services/geocodingService'

const brazilianStates = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'],
  ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'],
  ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'],
  ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
]

const CollectionPoints = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('pendentes')

  const [pontos, setPontos] = useState([])
  const [loading, setLoading] = useState(true)
  const [clothTypes, setClothTypes] = useState([])
  const [loadingClothTypes, setLoadingClothTypes] = useState(false)
  const [clothTypesError, setClothTypesError] = useState('')
  const [formError, setFormError] = useState('')

  const [loadingCep, setLoadingCep] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [cepError, setCepError] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    street: '',
    number: '',
    complement: '',
    bairro: '',
    zipCode: '',
    cidade: '',
    state: 'PE',
    latitude: '',
    longitude: '',
    openTime: '08:00',
    closeTime: '18:00',
    clothTypeIds: [],
  })


  const buscarLocalizacao = async () => {
    if (
      !formData.street ||
      !formData.number ||
      !formData.bairro ||
      !formData.cidade ||
      !formData.state
    ) {
      return
    }

    try {
      setLoadingLocation(true)
      setFormError('')

      const location = await geocodingService.geocodificarEndereco({
        street: formData.street,
        number: formData.number,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.state,
        country: 'Brasil',
      })

      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }))
    } catch (error) {
      console.error('Erro ao localizar endereço:', error)

      setFormData((prev) => ({
        ...prev,
        latitude: '',
        longitude: '',
      }))

      setFormError(
        error.message || 'Não foi possível localizar o endereço.'
      )
    } finally {
      setLoadingLocation(false)
    }
  }

  const handleCepChange = async (e) => {
    const value = e.target.value
    const cep = value.replace(/\D/g, '')

    const cepFormatado =
      cep.length > 5
        ? `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
        : cep

    setFormData((prev) => ({
      ...prev,
      zipCode: cepFormatado,
      street: '',
      bairro: '',
      cidade: '',
      state: '',
      latitude: '',
      longitude: '',
    }))

    setCepError('')

    if (cep.length !== 8) {
      return
    }

    try {
      setLoadingCep(true)

      const data = await cepService.buscarCep(cep)

      setFormData((prev) => ({
        ...prev,
        zipCode: cepFormatado,
        street: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        state: data.uf || '',
        latitude: '',
        longitude: '',
      }))
    } catch (error) {
      setCepError(error.message)

      setFormData((prev) => ({
        ...prev,
        street: '',
        bairro: '',
        cidade: '',
        state: '',
        latitude: '',
        longitude: '',
      }))
    } finally {
      setLoadingCep(false)
    }
  }



  const [selectedDays, setSelectedDays] = useState(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])

  const daysOfWeek = [
    ['MONDAY', 'Segunda'],
    ['TUESDAY', 'Terça'],
    ['WEDNESDAY', 'Quarta'],
    ['THURSDAY', 'Quinta'],
    ['FRIDAY', 'Sexta'],
    ['SATURDAY', 'Sábado'],
    ['SUNDAY', 'Domingo'],
  ]


  const fetchPontos = async () => {
    try {
      const data = await pointService.getPontos()
      const normalizedPoints = data.map((point) => {
        const address = point.address
        const addressText = typeof address === 'string'
          ? address
          : [address?.street, address?.number, address?.neighborhood, address?.city, address?.state]
            .filter(Boolean)
            .join(', ')
        const statusByApiValue = {
          ACTIVE: 'ATIVO',
          APPROVED: 'ATIVO',
          PENDING: 'PENDENTE',
          SUSPENDED: 'PAUSADO',
        }

        return {
          ...point,
          nome: point.name || point.nome || 'Ponto de coleta',
          endereco: addressText,
          cidade: addressText,
          horario: Array.isArray(point.operatingHours)
            ? point.operatingHours.map((hour) => `${hour.dayOfWeek}: ${hour.openingTime} às ${hour.closingTime}`).join(' • ')
            : '',
          status: statusByApiValue[point.status] || point.status,
        }
      })

      setPontos(normalizedPoints)
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

  const handleOpenModal = async () => {
    setEditingId(null)
    setFormError('')
    setFormData({
      nome: '', street: '', number: '', complement: '', bairro: '', zipCode: '',
      cidade: '', state: 'PE', latitude: '', longitude: '', openTime: '08:00', closeTime: '18:00', clothTypeIds: [],
    })
    setSelectedDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])
    setClothTypesError('')
    setLoadingClothTypes(true)
    setIsModalOpen(true)
    setCepError('')
    setLoadingCep(false)
    setLoadingLocation(false)

    try {
      const availableClothTypes = await pointService.getClothTypes()
      setClothTypes(availableClothTypes)
      if (availableClothTypes.length === 0) {
        setClothTypesError('Nenhum tipo de tecido foi cadastrado no sistema.')
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de tecido:', error)
      setClothTypesError(error.data?.message || 'Não foi possível carregar os tipos de tecido. Verifique sua sessão de administrador.')
    } finally {
      setLoadingClothTypes(false)
    }
  }

  const handleEditPoint = async (id) => {
    setEditingId(id)
    setFormError('')
    setIsModalOpen(true)

    try {
      const [point, availableClothTypes] = await Promise.all([
        pointService.getPontoById(id),
        pointService.getClothTypes(),
      ])
      const address = point.address || {}
      const operatingHours = point.operatingHours || []
      const acceptedTypes = point.acceptedClothTypes || []
      const activeDays = operatingHours.map((hour) => hour.dayOfWeek)

      setClothTypes(availableClothTypes)
      setClothTypesError(availableClothTypes.length === 0 ? 'Nenhum tipo de tecido foi cadastrado no sistema.' : '')
      setFormData({
        nome: point.name || '',
        street: address.street || '',
        number: address.number || '',
        complement: address.complement || '',
        bairro: address.neighborhood || '',
        zipCode: address.zipCode || '',
        cidade: address.city || '',
        state: address.state || 'PE',
        latitude: point.latitude ?? address.latitude ?? '',
        longitude: point.longitude ?? address.longitude ?? '',
        openTime: operatingHours[0]?.openingTime || '08:00',
        closeTime: operatingHours[0]?.closingTime || '18:00',
        clothTypeIds: availableClothTypes
          .filter((clothType) => acceptedTypes.includes(clothType.name))
          .map((clothType) => clothType.id),
      })
      setSelectedDays(activeDays)
    } catch (error) {
      console.error('Erro ao carregar ponto para edição:', error)
      setFormError(error.data?.message || 'Não foi possível carregar os dados do ponto.')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (clothTypes.length === 0) {
      setFormError(clothTypesError || 'Cadastre tipos de tecido antes de criar um ponto de coleta.')
      return
    }

    if (formData.clothTypeIds.length === 0) {
      setFormError('Selecione ao menos um tipo de tecido aceito.')
      return
    }

    if (selectedDays.length === 0) {
      setFormError('Selecione ao menos um dia de funcionamento.')
      return
    }


    if (!formData.latitude || !formData.longitude) {
      setFormError(
        'Não foi possível localizar o endereço. Informe um número de imóvel válido.'
      )
      return
    }

    const latitude = Number(formData.latitude)
    const longitude = Number(formData.longitude)

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setFormError('Latitude inválida. Informe um valor entre -90 e 90.')
      return
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setFormError('Longitude inválida. Informe um valor entre -180 e 180.')
      return
    }

    if (formData.state === 'PE' && (latitude >= 0 || longitude >= 0)) {
      setFormError('Para um ponto em Pernambuco, latitude e longitude devem ser negativas. Confira as coordenadas no mapa.')
      return
    }

    const pointData = {
      name: formData.nome.trim(),
      address: {
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement.trim() || undefined,
        neighborhood: formData.bairro.trim(),
        city: formData.cidade,
        state: formData.state,
        country: 'Brasil',
        zipCode: formData.zipCode.replace(/\D/g, ''),
      },
      latitude,
      longitude,
      imageUrl: formData.imageUrl || 'https://example.com/imagem.jpg',
      clothTypeIds: formData.clothTypeIds,
      operatingHours: selectedDays.map((dayOfWeek) => ({
        dayOfWeek,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
      })),
    }

    try {
      if (editingId) {
        const { operatingHours, ...updateData } = pointData
        await pointService.updatePonto(editingId, {
          ...updateData,
          operatingHour: operatingHours,
        })
      } else {
        console.log(
          'PAYLOAD ENVIADO:',
          JSON.stringify(pointData, null, 2)
        )
        await pointService.createPonto(pointData)
      }

      setIsModalOpen(false)
      setEditingId(null)
      setFormData({
        nome: '', street: '', number: '', complement: '', bairro: '', zipCode: '',
        cidade: '', state: 'PE', latitude: '', longitude: '', openTime: '08:00', closeTime: '18:00', clothTypeIds: [],
      })
      setSelectedDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])
      await fetchPontos()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setFormError(error.data?.message || "Erro ao salvar o ponto de coleta.")
    }
  }


  const handleTogglePause = async (id, statusAtual) => {
    const isActive = statusAtual === 'ATIVO'
    const acao = isActive ? 'pausar' : 'reativar'
    if (window.confirm(`Deseja ${acao} o recebimento deste ponto?`)) {
      try {
        const novoStatus = isActive ? 'SUSPENDED' : 'ACTIVE'
        await pointService.toggleStatus(id, novoStatus)
        fetchPontos()
      } catch (error) {
        console.error("Erro ao alterar status:", error)
        alert("Erro ao alterar o status.")
      }
    }
  }

  const handleApprove = async (id) => {
    try {
      await pointService.approvePonto(id)
      await fetchPontos()
    } catch (error) {
      console.error('Erro ao aprovar ponto:', error)
      alert(error.data?.message || 'Erro ao aprovar ponto de coleta.')
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Deseja rejeitar este ponto de coleta?')) return

    try {
      await pointService.rejectPonto(id)
      await fetchPontos()
    } catch (error) {
      console.error('Erro ao rejeitar ponto:', error)
      alert(error.data?.message || 'Erro ao rejeitar ponto de coleta.')
    }
  }

  const visiblePontos = pontos.filter((ponto) => {
    const matchesSearch = (ponto.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesView = view === 'todos' || ponto.status === 'PENDENTE'
    return matchesSearch && matchesView
  })


  return (
    <div className="w-full bg-white p-8 min-h-[calc(100vh-70px)]">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pontos de coleta</h1>
        <button
          onClick={handleOpenModal}
          className="bg-[#123C2C] hover:bg-[#1a5640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          + Adicionar ponto
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => setView('pendentes')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'pendentes' ? 'bg-amber-100 text-amber-800' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <RiFilterLine />
          Pendentes ({pontos.filter((ponto) => ponto.status === 'PENDENTE').length})
        </button>
        <button
          type="button"
          onClick={() => setView('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'todos' ? 'bg-[#123C2C] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Todos ({pontos.length})
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
              <th className="px-6 py-4">Endereço</th>
              <th className="px-6 py-4">Horário</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-32">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                  Carregando pontos de coleta...
                </td>
              </tr>
            ) : visiblePontos.map((ponto) => (
              <tr key={ponto.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-800">{ponto.nome}</td>
                <td className="px-6 py-4">{ponto.cidade}</td>
                <td className="px-6 py-4">{ponto.horario}</td>


                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${ponto.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700' : ponto.status === 'PENDENTE' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {ponto.status === 'ATIVO' ? 'Aprovado' : ponto.status === 'PENDENTE' ? 'Pendente' : 'Pausado'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-lg">
                    {ponto.status === 'PENDENTE' ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(ponto.id)}
                        className="text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                        title="Aprovar ponto"
                      >
                        <RiCheckLine />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTogglePause(ponto.id, ponto.status)}
                        className={`${ponto.status === 'ATIVO' ? 'text-amber-500 hover:text-amber-700' : 'text-emerald-500 hover:text-emerald-700'} transition-colors cursor-pointer`}
                        title={ponto.status === 'ATIVO' ? 'Pausar recebimento' : 'Reativar recebimento'}
                      >
                        {ponto.status === 'ATIVO' ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleEditPoint(ponto.id)}
                      className="text-orange-500 hover:text-orange-700 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <RiPencilLine />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(ponto.id)}
                      disabled={ponto.status !== 'PENDENTE'}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                      title={ponto.status === 'PENDENTE' ? 'Rejeitar ponto' : 'Apenas pontos pendentes podem ser rejeitados'}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 bg-white">
          Mostrando {visiblePontos.length} de {pontos.length} pontos
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar ponto de coleta' : 'Adicionar ponto de coleta'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">
                <RiCloseLine />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="form-ponto" onSubmit={handleSubmit} className="space-y-4 text-sm">
                {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nome*</label>
                  <input type="text" required placeholder="Ex: ONG Mãos Solidárias" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Endereço*</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Rua ou avenida"
                      value={formData.street}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-600 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Número"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      onBlur={buscarLocalizacao}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Bairro"
                      value={formData.bairro}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-600 cursor-not-allowed"
                    />
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        CEP*
                      </label>

                      <input
                        type="text"
                        required
                        maxLength={9}
                        placeholder="00000-000"
                        value={formData.zipCode}
                        onChange={handleCepChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]"
                      />

                      {loadingCep && (
                        <p className="mt-1 text-xs text-gray-500">
                          Buscando endereço...
                        </p>
                      )}

                      {cepError && (
                        <p className="mt-1 text-xs text-red-600">
                          {cepError}
                        </p>
                      )}
                    </div>
                    <input type="text" placeholder="Complemento" value={formData.complement} onChange={(e) => setFormData({ ...formData, complement: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                    <input
                      type="text"
                      required
                      placeholder="Cidade"
                      value={formData.cidade}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-600 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      required
                      value={formData.state}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Localização*</label>
                  <div>
                  

                    {loadingLocation && (
                      <p className="text-xs text-gray-500 mb-2">
                        Localizando endereço...
                      </p>
                    )}

                    {formData.latitude && formData.longitude ? (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                        <p className="text-sm font-medium text-emerald-800">
                          ✓ Localização encontrada
                        </p>

                        <p className="text-xs text-emerald-700 mt-1">
                          Latitude: {formData.latitude}
                        </p>

                        <p className="text-xs text-emerald-700">
                          Longitude: {formData.longitude}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Informe o número do imóvel para localizar automaticamente.
                      </p>
                    )}
                  </div>
                </div>
                <fieldset>
                  <legend className="mb-2 block font-semibold text-gray-700">Tipos de tecido aceitos*</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {clothTypes.map((clothType) => (
                      <label key={clothType.id} className="flex items-center gap-2 text-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.clothTypeIds.includes(clothType.id)}
                          onChange={(event) => setFormData((current) => ({
                            ...current,
                            clothTypeIds: event.target.checked
                              ? [...current.clothTypeIds, clothType.id]
                              : current.clothTypeIds.filter((id) => id !== clothType.id),
                          }))}
                        />
                        {clothType.name}
                      </label>
                    ))}
                  </div>
                  {loadingClothTypes && <p className="text-xs text-gray-500">Carregando tipos de tecido...</p>}
                  {!loadingClothTypes && clothTypesError && <p className="text-xs text-red-600">{clothTypesError}</p>}
                </fieldset>
                <fieldset>
                  <legend className="mb-2 block font-semibold text-gray-700">Dias e horário de funcionamento*</legend>
                  <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {daysOfWeek.map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(value)}
                          onChange={(event) => setSelectedDays((current) => event.target.checked
                            ? [...current, value]
                            : current.filter((day) => day !== value))}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="time" required aria-label="Horário de abertura" value={formData.openTime} onChange={(e) => setFormData({ ...formData, openTime: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                    <input type="time" required aria-label="Horário de fechamento" value={formData.closeTime} onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#123C2C]" />
                  </div>
                </fieldset>
              </form>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl bg-white">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit" form="form-ponto" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#123C2C] rounded-lg hover:bg-[#1a5640] transition-colors cursor-pointer">
                {editingId ? 'Salvar alterações' : 'Salvar ponto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionPoints