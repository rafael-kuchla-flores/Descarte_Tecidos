
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiTimeLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiCheckboxCircleLine,
  RiHeartLine,
  RiHeartFill,
  RiMap2Line,
  RiBuildingLine,
  RiRecycleLine,
  RiStore2Line,
  RiLeafLine,
} from 'react-icons/ri'

import Header from '../../../components/Header/Header'
import collectionPointService from '../../../services/collectionPointService'
import { useFavorites, COLLECTION_POINT_FAVORITES_KEY } from '../../../hooks/useFavorites'

const ICONS = {
  building: RiBuildingLine,
  recycle: RiRecycleLine,
  factory: RiStore2Line,
  leaf: RiLeafLine,
}

// Converts API material data into a readable label.
const getMaterialName = (material) => {
  if (typeof material === 'string') {
    return material
  }

  if (material && typeof material === 'object') {
    return (
      material.name ||
      material.label ||
      material.clothType?.name ||
      material.material?.name ||
      material.description ||
      ''
    )
  }

  return ''
}

// Returns a user-friendly label for the collection point status.
const getStatusInfo = (status) => {
  switch (status) {
    case 'ATIVO':
    case 'ACTIVE':
      return {
        label: 'Recebendo doações',
        className: 'bg-emerald-50 text-emerald-700',
      }

    case 'PAUSADO':
    case 'PAUSED':
    case 'SUSPENDED':
      return {
        label: 'Indisponível temporariamente',
        className: 'bg-amber-50 text-amber-700',
      }

    case 'PENDENTE':
    case 'PENDING':
      return {
        label: 'Aguardando aprovação',
        className: 'bg-gray-100 text-gray-700',
      }

    default:
      return {
        label: 'Situação não informada',
        className: 'bg-gray-100 text-gray-700',
      }
  }
}

const CollectionPointDetail = () => {
  const { id } = useParams()

  const [point, setPoint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const { isFavorite: checkFavorite, toggleFavorite, favoriteError, loadingFavorites, favoritesReady, savingFavorite, usingAccount } = useFavorites(COLLECTION_POINT_FAVORITES_KEY)
  const isFavorite = checkFavorite(id)

  // Loads collection point details from the API.
  useEffect(() => {
    let cancelled = false

    const fetchPoint = async () => {
      setLoading(true)
      setError('')
      setPoint(null)

      try {
        const data = await collectionPointService.getPointById(id)

        if (!cancelled) {
          setPoint(data)
        }
      } catch (requestError) {
        console.error(
          'Failed to load collection point:',
          requestError
        )

        if (!cancelled) {
          setPoint(null)
          setError(
            requestError?.status === 401
              ? 'É necessário autenticar-se para consultar este ponto.'
              : 'Não foi possível carregar o ponto de coleta.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPoint()

    return () => {
      cancelled = true
    }
  }, [id, retryKey])

  const handleFavorite = () => {
    void toggleFavorite(id)
  }

  const handleRetry = () => {
    setRetryKey((previous) => previous + 1)
  }

  // Shows a loading message while requesting the API.
  if (loading) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p role="status" className="text-gray-500">
            Carregando informações do ponto de coleta...
          </p>
        </main>
      </>
    )
  }

  // Shows an error or not-found message.
  if (error || !point) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2
            role={error ? 'alert' : undefined}
            className="mb-3 text-xl font-bold text-gray-800"
          >
            {error || 'Ponto de coleta não encontrado'}
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            {error
              ? 'Verifique sua conexão ou autenticação e tente novamente.'
              : 'O ponto solicitado não está disponível.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {error && (
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-green-900 px-4 py-2 font-semibold text-white hover:bg-green-800"
              >
                Tentar novamente
              </button>
            )}

            <Link
              to="/pontos-de-coleta"
              className="inline-flex items-center gap-2 font-semibold text-green-800 hover:underline"
            >
              <RiArrowLeftLine />
              Voltar para a lista
            </Link>
          </div>
        </main>
      </>
    )
  }

  const Icon = ICONS[point.iconType] || RiBuildingLine
  const statusInfo = getStatusInfo(point.status)

  const materialsSource = Array.isArray(point.materials)
    ? point.materials
    : Array.isArray(point.acceptedClothTypes)
      ? point.acceptedClothTypes
      : []

  const materials = [
    ...new Set(materialsSource.map(getMaterialName).filter(Boolean)),
  ]

  const address = point.address || 'Endereço não informado'
  const city = point.city || ''

  const fullAddress = [address, city]
    .filter(
      (value, index) =>
        index === 0 ||
        !address.toLowerCase().includes(String(value).toLowerCase())
    )
    .join(', ')

  const hasCoordinates =
    point.latitude !== null &&
    point.latitude !== undefined &&
    point.longitude !== null &&
    point.longitude !== undefined &&
    Number.isFinite(Number(point.latitude)) &&
    Number.isFinite(Number(point.longitude))

  const mapDestination = hasCoordinates
    ? `${point.latitude},${point.longitude}`
    : [point.name, fullAddress].filter(Boolean).join(', ')

  const hasMapDestination =
    hasCoordinates ||
    (address !== 'Endereço não informado' && Boolean(address))

  const googleMapsDirectionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      mapDestination
    )}`

  const googleMapsEmbedUrl =
    `https://maps.google.com/maps?q=${encodeURIComponent(
      mapDestination
    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back navigation */}
        <Link
          to="/pontos-de-coleta"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <RiArrowLeftLine className="text-base" />
          Voltar para os pontos
        </Link>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Collection point header */}
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {point.photo ? (
                  <img
                    src={point.photo}
                    alt={`Foto de ${point.name}`}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <Icon className="text-4xl text-[#153D2C]" />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                  {point.name}
                </h1>

                {city && (
                  <p className="mt-0.5 text-sm font-medium text-gray-500">
                    {city}
                  </p>
                )}

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Opening hours and phone */}
            <div className="flex flex-col gap-2.5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <RiTimeLine className="shrink-0 text-lg text-red-500" />

                <span>
                  {point.hours === 'Horário comercial'
                    ? 'Horário não informado'
                    : point.hours || 'Horário não informado'}
                </span>
              </div>

              {point.phone && (
                <div className="flex items-center gap-2">
                  <RiPhoneLine className="shrink-0 text-lg text-red-500" />

                  <a
                    href={`tel:${String(point.phone).replace(/[^\d+]/g, '')}`}
                    className="break-all hover:underline"
                  >
                    {point.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            {point.description && (
              <p className="text-sm leading-relaxed text-gray-600">
                {point.description}
              </p>
            )}

            {/* Address and accepted materials */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address card */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <RiMapPin2Line className="text-lg text-red-500" />
                  <span>Endereço</span>
                </div>

                <p className="text-sm leading-snug text-gray-700">
                  {address}
                </p>

                {city &&
                  !address.toLowerCase().includes(city.toLowerCase()) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {city}
                    </p>
                  )}
              </div>

              {/* Accepted materials card */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <RiCheckboxCircleLine className="text-lg text-emerald-600" />
                  <span>Materiais aceitos</span>
                </div>

                {materials.length > 0 ? (
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {materials.map((material) => (
                      <li
                        key={material}
                        className="flex items-center gap-1.5"
                      >
                        <RiCheckboxCircleLine
                          aria-hidden="true"
                          className="shrink-0 text-sm text-emerald-600"
                        />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    Materiais não informados.
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {hasMapDestination && (
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#153D2C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1e543d]"
                >
                  <RiMap2Line className="text-lg" />
                  Como chegar
                </a>
              )}

              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={isFavorite}
                disabled={loadingFavorites || !favoritesReady || savingFavorite}
                aria-label={
                  isFavorite
                    ? 'Remover ponto dos favoritos'
                    : 'Adicionar ponto aos favoritos'
                }
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isFavorite
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isFavorite ? (
                  <RiHeartFill className="text-lg text-rose-500" />
                ) : (
                  <RiHeartLine className="text-lg text-gray-400" />
                )}

                <span>
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </span>
              </button>

              {favoriteError && (
                <p
                  role="alert"
                  className="w-full text-sm text-red-700"
                >
                  {favoriteError}
                </p>
              )}

              <p className="w-full text-xs text-gray-500">
                {usingAccount ? 'Favoritos sincronizados com sua conta.' : 'Entre para sincronizar seus favoritos. Sem login, eles ficam somente neste navegador.'}
              </p>
            </div>
          </div>

          {/* Right column: Google Maps */}
          <div className="lg:col-span-5">
            {hasMapDestination ? (
              <div className="h-80 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm sm:h-96 lg:h-[420px]">
                <iframe
                  title={`Mapa de localização - ${point.name}`}
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center sm:h-96 lg:h-[420px]">
                <p className="text-sm text-gray-500">
                  Localização não informada para exibição no mapa.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default CollectionPointDetail
