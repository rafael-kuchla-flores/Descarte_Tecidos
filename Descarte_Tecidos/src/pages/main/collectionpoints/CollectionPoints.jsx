
import { useState, useEffect } from 'react'
import {
  RiSearchLine,
  RiMapPinLine,
  RiMap2Line,
} from 'react-icons/ri'

import Header from '../../../components/Header/Header'
import CollectionPointCard from '../../../components/CollectionPointCard/CollectionPointCard'
import collectionPointService from '../../../services/collectionPointService'
import cashbackService from '../../../services/cashbackService'
import { Link } from 'react-router-dom'

// Reads material names from strings or API objects.
const getMaterialName = (material) => {
  if (typeof material === 'string') return material

  return (
    material?.name ||
    material?.clothType?.name ||
    material?.label ||
    ''
  )
}

// Reads a material ID only when it is explicitly available.
const getMaterialId = (material) => {
  if (!material || typeof material !== 'object') return null

  const id = material.clothTypeId ?? material.clothType?.id ?? material.id

  if (id === null || id === undefined || id === '') return null

  return id
}

// Calculates distance using geographic coordinates.
const calculateDistance = (origin, point) => {
  if (
    !origin ||
    point.latitude == null ||
    point.longitude == null
  ) {
    return null
  }

  const latitude = Number(point.latitude)
  const longitude = Number(point.longitude)

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  const earthRadiusKm = 6371
  const toRadians = (value) => (value * Math.PI) / 180

  const latitudeDifference = toRadians(
    latitude - origin.latitude
  )

  const longitudeDifference = toRadians(
    longitude - origin.longitude
  )

  const originLatitude = toRadians(origin.latitude)
  const pointLatitude = toRadians(latitude)

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(pointLatitude) *
      Math.sin(longitudeDifference / 2) ** 2

  return (
    earthRadiusKm *
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(1 - haversine)
    )
  )
}

const formatDistance = (distance) =>
  `${distance.toFixed(1).replace('.', ',')} km`

const getDistanceInKm = (point, coords) => {
  const calculatedDistance = calculateDistance(coords, point)

  if (calculatedDistance !== null) {
    return calculatedDistance
  }

  if (point.distanceKm != null) {
    const apiDistance = Number(point.distanceKm)
    return Number.isFinite(apiDistance) ? apiDistance : null
  }

  const parsedDistance = Number.parseFloat(
    String(point.distance || '').replace(',', '.')
  )

  return Number.isFinite(parsedDistance)
    ? parsedDistance
    : null
}

const getStatusInfo = (status) => {
  switch (status) {
    case 'ATIVO':
    case 'ACTIVE':
      return {
        label: 'Recebendo',
        className: 'bg-emerald-50 text-emerald-700',
      }

    case 'PAUSADO':
    case 'PAUSED':
    case 'SUSPENDED':
      return {
        label: 'Indisponível',
        className: 'bg-amber-50 text-amber-700',
      }

    case 'PENDENTE':
    case 'PENDING':
      return {
        label: 'Pendente',
        className: 'bg-gray-100 text-gray-700',
      }

    default:
      return {
        label: 'Status não informado',
        className: 'bg-gray-100 text-gray-700',
      }
  }
}

export default function CollectionPoints() {
  const [points, setPoints] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPointId, setSelectedPointId] = useState(null)

  const [locationState, setLocationState] = useState({
    status: 'idle',
    coords: null,
    error: '',
  })

  const [filters, setFilters] = useState({
    material: '',
    maxDistance: '',
  })

  // Keeps available materials even after API filtering.
  const [materialOptions, setMaterialOptions] = useState([])

  // Loads the real textile catalog, even when no collection point uses a type yet.
  useEffect(() => {
    let active = true
    cashbackService.getPublicClothTypes()
      .then((types) => {
        if (!active) return
        setMaterialOptions((previous) => {
          const byName = new Map(previous.map((item) => [item.name.toLowerCase(), item]))
          types
            .filter((type) => type?.id != null && type?.name && type.isActive !== false)
            .forEach((type) => {
              byName.set(type.name.toLowerCase(), { name: type.name, id: type.id })
            })
          return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        })
      })
      .catch((error) => console.error('Catálogo de tecidos indisponível:', error))
    return () => { active = false }
  }, [])

  // Collects material names and IDs from API responses.
  const registerMaterials = (collectionPoints) => {
    setMaterialOptions((previousOptions) => {
      const optionsByName = new Map(
        previousOptions.map((option) => [
          option.name.toLowerCase(),
          option,
        ])
      )

      collectionPoints.forEach((point) => {
        const materials = Array.isArray(point.materials)
          ? point.materials
          : []

        materials.forEach((material) => {
          const name = getMaterialName(material)
          const id = getMaterialId(material)

          if (!name) return

          const key = name.toLowerCase()
          const existingOption = optionsByName.get(key)

          optionsByName.set(key, {
            name: existingOption?.name || name,
            id: id ?? existingOption?.id ?? null,
          })
        })
      })

      return [...optionsByName.values()].sort((first, second) =>
        first.name.localeCompare(second.name, 'pt-BR')
      )
    })
  }

  // Requests browser geolocation only after user interaction.
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({
        status: 'unavailable',
        coords: null,
        error: 'Seu navegador não oferece localização.',
      })
      return
    }

    setLocationState({
      status: 'requesting',
      coords: null,
      error: '',
    })

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationState({
          status: 'granted',
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          error: '',
        })
      },
      () => {
        setLocationState({
          status: 'denied',
          coords: null,
          error:
            'Não foi possível acessar sua localização. Você pode buscar por cidade ou bairro.',
        })
      }
    )
  }

  // Loads collection points from the API.
  useEffect(() => {
    let cancelled = false

    const fetchPoints = async () => {
      setLoading(true)
      setError('')

      try {
        // Retrieve all APPROVED points so a city search is not limited to the
        // visitor's current 100-km radius. Distance is calculated locally below.
        const data = await collectionPointService.getCollectionPoints()

        if (!cancelled) {
          const collectionPoints = Array.isArray(data)
            ? data
            : []

          setPoints(collectionPoints)
          registerMaterials(collectionPoints)
        }
      } catch (requestError) {
        console.error(
          'Failed to load collection points:',
          requestError
        )

        if (!cancelled) {
          setPoints([])
          setError(
            requestError?.message ||
              'Não foi possível carregar os pontos de coleta.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPoints()

    return () => {
      cancelled = true
    }
  }, [])

  // Applies local filters to the loaded collection points.
  const filteredPoints = points
    .map((point) => {
      const calculatedDistance = calculateDistance(
        locationState.coords,
        point
      )

      return calculatedDistance === null
        ? point
        : {
            ...point,
            distance: formatDistance(calculatedDistance),
            calculatedDistance,
          }
    })
    .filter((point) => {
      const normalizeText = (value) => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
      const normalizedSearch = normalizeText(search).trim()
      const materialFilter = normalizeText(filters.material)

      const searchableText = [
        point.name,
        point.city,
        point.address,
      ]
        .filter(Boolean)
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch)

      const materials = Array.isArray(point.materials)
        ? point.materials
        : []

      const matchesMaterial =
        !materialFilter ||
        materials.some((material) =>
          normalizeText(getMaterialName(material))
            .includes(materialFilter)
        )

      const maxDistance = filters.maxDistance
        ? Number(filters.maxDistance)
        : null

      const pointDistance = getDistanceInKm(
        point,
        locationState.coords
      )

      const matchesDistance =
        maxDistance === null ||
        (
          pointDistance !== null &&
          pointDistance <= maxDistance
        )

      return (
        matchesSearch &&
        matchesMaterial &&
        matchesDistance
      )
    })
    .sort((firstPoint, secondPoint) => {
      if (!locationState.coords) return 0

      const firstDistance = getDistanceInKm(
        firstPoint,
        locationState.coords
      )

      const secondDistance = getDistanceInKm(
        secondPoint,
        locationState.coords
      )

      if (firstDistance === null) return 1
      if (secondDistance === null) return -1

      return firstDistance - secondDistance
    })

  const activePoint =
    filteredPoints.find(
      (point) => point.id === selectedPointId
    ) ||
    filteredPoints[0] ||
    null

  const mapQuery = activePoint
    ? [activePoint.name, activePoint.address]
        .filter(Boolean)
        .join(', ')
    : search
      ? `${search}, Brasil`
      : 'Brasil'

  const mapEmbedUrl =
    `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}` +
    `&t=&z=${activePoint ? '15' : '5'}&ie=UTF8&iwloc=&output=embed`

  const directionsUrl = activePoint
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        mapQuery
      )}`
    : '#'

  const statusInfo = activePoint
    ? getStatusInfo(activePoint.status)
    : null

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))

    setSelectedPointId(null)
  }

  const clearFilters = () => {
    setSearch('')
    setFilters({
      material: '',
      maxDistance: '',
    })
    setSelectedPointId(null)
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pontos de coleta
          </h1>

          <p className="text-gray-500 mt-2">
            Encontre o ponto de descarte ou doação mais próximo de você.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Sua empresa ou organização recebe resíduos têxteis?{' '}
            <Link to="/seja-parceiro" className="font-semibold text-emerald-800 underline underline-offset-2">
              Solicite o cadastro de um ponto de coleta
            </Link>
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 max-w-2xl mx-auto mb-6">
          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <RiSearchLine className="text-gray-400" />

            <input
              type="text"
              placeholder="Digite sua cidade ou bairro..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 min-w-0 outline-none text-sm text-gray-700"
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedPointId(null)}
            className="bg-[#153D2C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1f5c42]"
          >
            Buscar
          </button>
        </div>

        {/* Geolocation */}
        <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#153D2C]">
                {locationState.status === 'granted'
                  ? 'Resultados ordenados pela sua localização'
                  : 'Encontre o ponto mais próximo'}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {locationState.status === 'requesting'
                  ? 'Solicitando permissão de localização...'
                  : locationState.error ||
                    'Permita sua localização para calcular as distâncias.'}
              </p>
            </div>

            <button
              type="button"
              onClick={requestLocation}
              disabled={locationState.status === 'requesting'}
              className="shrink-0 rounded-lg bg-[#153D2C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f5c42] disabled:opacity-60"
            >
              {locationState.status === 'granted'
                ? 'Atualizar localização'
                : 'Usar minha localização'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label
                htmlFor="material-filter"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Tipo de tecido
              </label>

              <select
                id="material-filter"
                value={filters.material}
                onChange={(event) =>
                  handleFilterChange(
                    'material',
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
              >
                <option value="">Todos os tecidos</option>

                {materialOptions.map((material) => (
                  <option
                    key={material.name}
                    value={material.name}
                  >
                    {material.name}
                  </option>
                ))}
              </select>
              {materialOptions.length === 0 && (
                <p className="mt-2 text-xs text-amber-800">
                  Ainda não há tipos de tecido disponíveis no catálogo. Um administrador
                  deve cadastrá-los ou a API precisa permitir a consulta.
                </p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="distance-filter"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Distância máxima
              </label>

              <select
                id="distance-filter"
                value={filters.maxDistance}
                onChange={(event) =>
                  handleFilterChange(
                    'maxDistance',
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
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
              disabled={
                !filters.material &&
                !filters.maxDistance &&
                !search
              }
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Limpar filtros
            </button>
          </div>

          {filters.maxDistance && !locationState.coords && (
            <p className="mt-3 text-xs text-gray-500">
              Permita sua localização para calcular distâncias
              precisas. Sem ela, usamos apenas as distâncias
              disponíveis nos dados dos pontos.
            </p>
          )}
        </div>

        {/* API error */}
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            Não foi possível consultar os pontos de coleta: {error}
          </p>
        )}

        {/* Results */}
        {loading ? (
          <p
            role="status"
            className="text-center text-gray-500"
          >
            Carregando pontos de coleta...
          </p>
        ) : error ? (
          <p className="text-center text-sm text-gray-500">
            Verifique sua conexão ou autenticação e tente novamente.
          </p>
        ) : (
          <>
            <p className="text-sm text-green-800 font-medium mb-4">
              {filteredPoints.length}{' '}
              {filteredPoints.length === 1
                ? 'ponto encontrado'
                : 'pontos encontrados'}
            </p>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Collection point cards */}
              <div className="flex-1 flex flex-col gap-4 w-full">
                {filteredPoints.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500 text-sm">
                      Nenhum ponto de coleta aprovado encontrado para essa busca.
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      O EcoTecidos exibe parceiros cadastrados. Você pode pesquisar outros
                      estabelecimentos no mapa externo e confirmar diretamente se recebem tecidos.
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`coleta ou reciclagem de tecidos e roupas ${search.trim() || 'Porto Alegre RS'}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline"
                    >
                      Buscar estabelecimentos no Google Maps (não verificados)
                    </a>

                    <button
                      type="button"
                      onClick={clearFilters}
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
                      isSelected={
                        activePoint?.id === point.id
                      }
                      onSelect={() =>
                        setSelectedPointId(point.id)
                      }
                    />
                  ))
                )}
              </div>

              {/* Map */}
              <div className="w-full lg:w-[440px] shrink-0">
                <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                    <div className="flex items-center gap-2">
                      <RiMapPinLine className="text-lg text-[#153D2C]" />

                      <h2 className="font-bold text-gray-900 text-sm">
                        Mapa interativo
                      </h2>
                    </div>

                    <span className="text-xs text-gray-500 font-medium">
                      Selecione um ponto para focar
                    </span>
                  </div>

                  <div className="w-full h-80 sm:h-96 bg-gray-100 relative">
                    <iframe
                      title="Mapa de pontos de coleta"
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Selected point */}
                  {activePoint ? (
                    <div className="p-4 bg-white flex flex-col gap-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#153D2C] bg-emerald-50 px-2 py-0.5 rounded-md">
                          Ponto em destaque
                        </span>

                        <h3 className="font-bold text-gray-900 text-sm mt-1.5">
                          {activePoint.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {activePoint.address}
                        </p>

                        <span
                          className={`inline-flex mt-2 w-fit rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#153D2C] hover:bg-[#1e543d] text-white py-2.5 px-3 rounded-lg text-xs font-semibold"
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
