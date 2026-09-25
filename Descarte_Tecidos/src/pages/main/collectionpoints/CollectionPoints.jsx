import { useState, useEffect } from 'react'
import { RiSearchLine, RiMapPinLine, RiMap2Line } from 'react-icons/ri'
import Header from '../../../components/Header/Header'
import CollectionPointCard from '../../../components/CollectionPointCard/CollectionPointCard'
import collectionPointService from '../../../services/collectionPointService'

const CollectionPoints = () => {
  const [points, setPoints] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [filteredPoints, setFilteredPoints] = useState([])
  const [selectedPointId, setSelectedPointId] = useState(null)
  const [locationState, setLocationState] = useState({ status: 'idle', coords: null, error: '' })
  const [filters, setFilters] = useState({ material: '', maxDistance: '' })

  const calculateDistance = (origin, point) => {
    if (!origin || point.latitude === null || point.longitude === null) return null

    const earthRadiusKm = 6371
    const toRadians = (value) => (value * Math.PI) / 180
    const latitudeDifference = toRadians(point.latitude - origin.latitude)
    const longitudeDifference = toRadians(point.longitude - origin.longitude)
    const originLatitude = toRadians(origin.latitude)
    const pointLatitude = toRadians(point.latitude)
    const haversine = Math.sin(latitudeDifference / 2) ** 2
      + Math.cos(originLatitude) * Math.cos(pointLatitude) * Math.sin(longitudeDifference / 2) ** 2

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  }

  const formatDistance = (distance) => `${distance.toFixed(1).replace('.', ',')} km`

  const sortByDistance = (list, coords) => list
    .map((point) => {
      const calculatedDistance = calculateDistance(coords, point)
      return calculatedDistance === null
        ? point
        : { ...point, distance: formatDistance(calculatedDistance), calculatedDistance }
    })
    .sort((firstPoint, secondPoint) => {
      if (firstPoint.calculatedDistance === undefined) return 1
      if (secondPoint.calculatedDistance === undefined) return -1
      return firstPoint.calculatedDistance - secondPoint.calculatedDistance
    })

  const getDistanceInKm = (point, coords) => {
    const calculatedDistance = calculateDistance(coords, point)
    if (calculatedDistance !== null) return calculatedDistance

    const parsedDistance = Number.parseFloat(String(point.distance || '').replace(',', '.'))
    return Number.isNaN(parsedDistance) ? null : parsedDistance
  }

  const filterPoints = (sourcePoints, nextFilters = filters, searchTerm = search, coords = locationState.coords) => {
    const normalizedSearch = searchTerm.toLowerCase().trim()
    const materialFilter = nextFilters.material.toLowerCase()
    const maxDistance = nextFilters.maxDistance ? Number(nextFilters.maxDistance) : null
    const preparedPoints = coords ? sortByDistance(sourcePoints, coords) : sourcePoints

    return preparedPoints.filter((point) => {
      const matchesSearch = !normalizedSearch
        || point.name.toLowerCase().includes(normalizedSearch)
        || point.city.toLowerCase().includes(normalizedSearch)
        || point.address.toLowerCase().includes(normalizedSearch)
      const matchesMaterial = !materialFilter
        || point.materials?.some((material) => material.toLowerCase().includes(materialFilter))
      const pointDistance = getDistanceInKm(point, coords)
      const matchesDistance = maxDistance === null
        || (pointDistance !== null && pointDistance <= maxDistance)

      return matchesSearch && matchesMaterial && matchesDistance
    })
  }

  const updateVisiblePoints = (nextFilters = filters, searchTerm = search, coords = locationState.coords) => {
    const result = filterPoints(points, nextFilters, searchTerm, coords)
    setFilteredPoints(result)
    setSelectedPointId(result.length > 0 ? result[0].id : null)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({ status: 'unavailable', coords: null, error: 'Seu navegador não oferece localização.' })
      return
    }

    setLocationState({ status: 'requesting', coords: null, error: '' })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const userCoords = { latitude: coords.latitude, longitude: coords.longitude }
        setLocationState({ status: 'granted', coords: userCoords, error: '' })
        updateVisiblePoints(filters, search, userCoords)
      },
      () => setLocationState({
        status: 'denied',
        coords: null,
        error: 'Não foi possível acessar sua localização. Você pode buscar por cidade ou bairro.'
      })
    )
  }

  // Busca os pontos da API ao carregar a página
  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true)
      const data = await collectionPointService.getCollectionPoints()
      setPoints(data)
      setFilteredPoints(data)
      if (data.length > 0) {
        setSelectedPointId(data[0].id)
      }
      setLoading(false)
    }
    fetchPoints()
  }, [])

  // Filtra os pontos conforme o usuário digita na busca
  const handleSearch = () => {
    updateVisiblePoints(filters, search)
  }

  const handleFilterChange = (name, value) => {
    const nextFilters = { ...filters, [name]: value }
    setFilters(nextFilters)
    updateVisiblePoints(nextFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { material: '', maxDistance: '' }
    setSearch('')
    setFilters(emptyFilters)
    updateVisiblePoints(emptyFilters, '')
  }

  // Permite buscar ao apertar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // Ponto atualmente em foco no mapa
  const activePoint = filteredPoints.find((p) => p.id === selectedPointId) || filteredPoints[0] || null

  // URL dinâmica do Google Maps Embed
  const mapQuery = activePoint
    ? `${activePoint.name}, ${activePoint.address}, ${activePoint.city}`
    : search
      ? `${search}, Brasil`
      : 'Recife, PE, Brasil'

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${activePoint ? '15' : '12'}&ie=UTF8&iwloc=&output=embed`

  const directionsUrl = activePoint
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePoint.name}, ${activePoint.address}, ${activePoint.city}`)}`
    : '#'

  const markerPositions = [
    { top: '28%', left: '32%' },
    { top: '44%', left: '58%' },
    { top: '64%', left: '38%' },
    { top: '70%', left: '72%' },
  ]

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pontos de coleta</h1>
          <p className="text-gray-500 mt-2">
            Encontre o ponto de descarte ou doação mais próximo de você.
          </p>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-3 max-w-2xl mx-auto mb-6">
          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <RiSearchLine className="text-gray-400" />
            <input
              type="text"
              placeholder="Digite sua cidade ou bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-sm text-gray-700"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#153D2C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1f5c42] transition-colors"
          >
            Buscar
          </button>
        </div>

        <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#153D2C]">
                {locationState.status === 'granted' ? 'Resultados ordenados pela sua localização' : 'Encontre o ponto mais próximo'}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {locationState.status === 'requesting'
                  ? 'Solicitando permissão de localização...'
                  : locationState.error || 'Permita sua localização para calcular as distâncias.'}
              </p>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              disabled={locationState.status === 'requesting'}
              className="shrink-0 rounded-lg bg-[#153D2C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1f5c42] disabled:cursor-wait disabled:opacity-60"
            >
              {locationState.status === 'granted' ? 'Atualizar localização' : 'Usar minha localização'}
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label htmlFor="material-filter" className="mb-1 block text-xs font-semibold text-gray-600">
                Tipo de tecido
              </label>
              <select
                id="material-filter"
                value={filters.material}
                onChange={(event) => handleFilterChange('material', event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#153D2C] focus:outline-none"
              >
                <option value="">Todos os tecidos</option>
                {[...new Set(points.flatMap((point) => point.materials || []))].map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="distance-filter" className="mb-1 block text-xs font-semibold text-gray-600">
                Distância máxima
              </label>
              <select
                id="distance-filter"
                value={filters.maxDistance}
                onChange={(event) => handleFilterChange('maxDistance', event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#153D2C] focus:outline-none"
              >
                <option value="">Qualquer distância</option>
                <option value="5">Até 5 km</option>
                <option value="10">Até 10 km</option>
                <option value="20">Até 20 km</option>
              </select>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!filters.material && !filters.maxDistance && !search}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Limpar filtros
            </button>
          </div>
          {filters.maxDistance && !locationState.coords && (
            <p className="mt-3 text-xs text-gray-500">
              A distância usa os valores disponíveis nos pontos. Permita sua localização para calcular distâncias precisas.
            </p>
          )}
        </div>

        {/* Resultado + Layout de duas colunas */}
        {loading ? (
          <p className="text-center text-gray-500">Carregando pontos de coleta...</p>
        ) : (
          <>
            <p className="text-sm text-green-800 font-medium mb-4">
              {filteredPoints.length} {filteredPoints.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}
            </p>

            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* Coluna esquerda: lista de cards */}
              <div className="flex-1 flex flex-col gap-4 w-full">
                {filteredPoints.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500 text-sm">Nenhum ponto encontrado para essa busca.</p>
                    <button
                      onClick={() => {
                        setSearch('')
                        setFilters({ material: '', maxDistance: '' })
                        updateVisiblePoints({ material: '', maxDistance: '' }, '')
                      }}
                      className="mt-3 text-[#153D2C] font-semibold text-sm hover:underline"
                    >
                      Limpar busca e ver todos os pontos
                    </button>
                  </div>
                ) : (
                  filteredPoints.map((point) => (
                    <CollectionPointCard
                      key={point.id}
                      point={point}
                      isSelected={point.id === selectedPointId}
                      onSelect={() => setSelectedPointId(point.id)}
                    />
                  ))
                )}
              </div>

              {/* Coluna direita: Painel do Mapa Interativo com Sticky Scroll */}
              <div className="w-full lg:w-[440px] shrink-0">
                <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">

                  {/* Topo do painel */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                    <div className="flex items-center gap-2">
                      <RiMapPinLine className="text-lg text-[#153D2C]" />
                      <h2 className="font-bold text-gray-900 text-sm">Mapa interativo</h2>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Clique em um card para focar
                    </span>
                  </div>

                  {/* Iframe do Google Maps */}
                  <div className="w-full h-80 sm:h-96 bg-gray-100 relative">
                    <iframe
                      title="Mapa interativo de pontos de coleta"
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {filteredPoints.map((point, index) => {
                      const position = markerPositions[index % markerPositions.length]
                      const isActive = point.id === selectedPointId

                      return (
                        <button
                          key={`marker-${point.id}`}
                          type="button"
                          aria-label={`Selecionar ${point.name} no mapa`}
                          title={point.name}
                          onClick={() => setSelectedPointId(point.id)}
                          className={`absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 ${isActive ? 'scale-125' : ''}`}
                          style={position}
                        >
                          <RiMapPinLine className={`drop-shadow-md ${point.status === 'PAUSADO' ? 'text-amber-600' : 'text-[#153D2C]'} text-3xl`} />
                        </button>
                      )
                    })}
                  </div>

                  {/* Resumo do Ponto em Destaque */}
                  {activePoint ? (
                    <div className="p-4 bg-white flex flex-col gap-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#153D2C] bg-emerald-50 px-2 py-0.5 rounded-md">
                          Ponto em destaque
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm mt-1.5 leading-snug">
                          {activePoint.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {activePoint.address} • {activePoint.city}
                        </p>
                        <span className={`inline-flex mt-2 w-fit rounded-full px-2 py-1 text-[10px] font-bold uppercase ${activePoint.status === 'PAUSADO'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                          }`}>
                          {activePoint.status === 'PAUSADO' ? 'Indisponível' : 'Recebendo'}
                        </span>
                      </div>

                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#153D2C] hover:bg-[#1e543d] text-white py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                      >
                        <RiMap2Line className="text-sm" />
                        Traçar rota no Google Maps
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      Nenhum ponto selecionado.
                    </div>
                  )}

                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </>
  )
}

export default CollectionPoints
