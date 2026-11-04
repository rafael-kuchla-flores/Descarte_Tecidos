
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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

import Header from '../../../components/header/Header'
import collectionPointService from '../../../services/collectionPointService'

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
    return material.name || material.label || material.description || ''
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
  const [isFavorite, setIsFavorite] = useState(false)

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
            requestError?.message ||
              'Não foi possível carregar o ponto de coleta.'
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
  }, [id])

  // Shows a loading message while requesting the API.
  if (loading) {
    return (
      <>
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p
            role="status"
            className="text-gray-500"
          >
            Carregando informações do ponto de coleta...
          </p>
        </main>
      </>
    )
  }

  // Shows an error or not-found message when the point is unavailable.
  if (error || !point) {
    return (
      <>
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2
            role={error ? 'alert' : undefined}
            className="text-xl font-bold text-gray-800 mb-3"
          >
            {error || 'Ponto de coleta não encontrado'}
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            {error
              ? 'Verifique sua conexão ou autenticação e tente novamente.'
              : 'O ponto solicitado não está disponível.'}
          </p>

          <Link
            to="/pontos-de-coleta"
            className="inline-flex items-center gap-2 text-green-800 font-semibold hover:underline"
          >
            <RiArrowLeftLine />
            Voltar para a lista
          </Link>
        </main>
      </>
    )
  }

  const Icon = ICONS[point.iconType] || RiBuildingLine

  const statusInfo = getStatusInfo(point.status)

  const materials = Array.isArray(point.materials)
    ? point.materials.map(getMaterialName).filter(Boolean)
    : []

  const address = point.address || 'Endereço não informado'
  const city = point.city || ''

  const fullAddress = [address, city]
    .filter(Boolean)
    .join(', ')

  const mapDestination = [point.name, fullAddress]
    .filter(Boolean)
    .join(', ')

  const googleMapsDirectionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      mapDestination
    )}`

  const googleMapsEmbedUrl =
    `https://maps.google.com/maps?q=${encodeURIComponent(
      mapDestination
    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`

  const handleFavorite = () => {
    setIsFavorite((currentValue) => !currentValue)
  }

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back navigation */}
        <Link
          to="/pontos-de-coleta"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 font-medium"
        >
          <RiArrowLeftLine className="text-base" />
          Voltar para os pontos
        </Link>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Collection point header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                {point.photo ? (
                  <img
                    src={point.photo}
                    alt={`Foto de ${point.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon className="text-4xl text-[#153D2C]" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {point.name}
                </h1>

                {city && (
                  <p className="text-sm text-gray-500 mt-0.5 font-medium">
                    {city}
                  </p>
                )}

                <span
                  className={`inline-flex mt-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Opening hours and phone */}
            <div className="flex flex-col gap-2.5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <RiTimeLine className="text-red-500 text-lg shrink-0" />

                <span>
                  {point.hours || 'Horário não informado'}
                </span>
              </div>

              {point.phone && (
                <div className="flex items-center gap-2">
                  <RiPhoneLine className="text-red-500 text-lg shrink-0" />

                  <span>{point.phone}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {point.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {point.description}
              </p>
            )}

            {/* Address and accepted materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                  <RiMapPin2Line className="text-red-500 text-lg" />

                  <span>Endereço</span>
                </div>

                <p className="text-sm text-gray-700 leading-snug">
                  {address}
                </p>

                {city && !address.toLowerCase().includes(city.toLowerCase()) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {city}
                  </p>
                )}
              </div>

              {/* Accepted materials card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                  <RiCheckboxCircleLine className="text-emerald-600 text-lg" />

                  <span>Materiais aceitos</span>
                </div>

                {materials.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    {materials.map((material, index) => (
                      <li
                        key={`${material}-${index}`}
                        className="flex items-center gap-1.5"
                      >
                        <RiCheckboxCircleLine
                          aria-hidden="true"
                          className="text-emerald-600 text-sm shrink-0"
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
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#153D2C] hover:bg-[#1e543d] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
              >
                <RiMap2Line className="text-lg" />
                Como chegar
              </a>

              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={isFavorite}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isFavorite ? (
                  <RiHeartFill className="text-rose-500 text-lg" />
                ) : (
                  <RiHeartLine className="text-gray-400 text-lg" />
                )}

                <span>
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </span>
              </button>
            </div>
          </div>

          {/* Right column: Google Maps */}
          <div className="lg:col-span-5">
            <div className="w-full h-80 sm:h-96 lg:h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
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
          </div>
        </div>
      </main>
    </>
  )
}

export default CollectionPointDetail
