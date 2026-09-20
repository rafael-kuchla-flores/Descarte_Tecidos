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
    RiLeafLine
} from 'react-icons/ri'
import Header from '../../../components/Header/Header'
import collectionPointService from '../../../services/collectionPointService'

const ICONS = {
    building: RiBuildingLine,
    recycle: RiRecycleLine,
    factory: RiStore2Line,
    leaf: RiLeafLine,
}

const CollectionPointDetail = () => {
    const { id } = useParams()
    const [point, setPoint] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const fetchPoint = async () => {
            setLoading(true)
            const data = await collectionPointService.getPointById(id)
            setPoint(data)
            setLoading(false)
        }
        fetchPoint()
    }, [id])

    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">
                    Carregando informações do ponto de coleta...
                </main>
            </>
        )
    }

    if (!point) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Ponto de coleta não encontrado</h2>
                    <Link to="/pontos-de-coleta" className="text-green-800 font-semibold hover:underline">
                        ← Voltar para a lista
                    </Link>
                </main>
            </>
        )
    }

    const Icon = ICONS[point.iconType] || RiBuildingLine
    const fullAddress = `${point.address}, ${point.city}`
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${point.name}, ${fullAddress}`)}`
    const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${point.name}, ${fullAddress}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`

    return (
        <>
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Link Voltar */}
                <Link
                    to="/pontos-de-coleta"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 font-medium"
                >
                    <RiArrowLeftLine className="text-base" /> Voltar para os pontos
                </Link>

                {/* Layout de duas colunas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Coluna Esquerda: Informações e Ações */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Cabeçalho do Ponto: Ícone grande + Nome + Cidade */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                                <Icon className="text-4xl text-[#153D2C]" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{point.name}</h1>
                                <p className="text-sm text-gray-500 mt-0.5 font-medium">{point.city}</p>
                            </div>
                        </div>

                        {/* Horário e Telefone */}
                        <div className="flex flex-col gap-2.5 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <RiTimeLine className="text-red-500 text-lg shrink-0" />
                                <span>{point.hours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RiPhoneLine className="text-red-500 text-lg shrink-0" />
                                <span>{point.phone}</span>
                            </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {point.description}
                        </p>

                        {/* Cards lado a lado: Endereço e Materiais aceitos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Card 1: Endereço */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                                    <RiMapPin2Line className="text-red-500 text-lg" />
                                    <span>Endereço</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-snug">
                                    {point.address}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {point.city}
                                </p>
                            </div>

                            {/* Card 2: Materiais aceitos */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                                    <RiCheckboxCircleLine className="text-emerald-600 text-lg" />
                                    <span>Materiais aceitos</span>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1.5">
                                    {point.materials?.map((material, idx) => (
                                        <li key={idx} className="flex items-center gap-1.5">
                                            <span className="text-emerald-600 font-bold text-xs">✓</span>
                                            <span>{material}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        {/* Botões de Ação */}
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
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors ${isFavorite
                                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {isFavorite ? (
                                    <RiHeartFill className="text-rose-500 text-lg" />
                                ) : (
                                    <RiHeartLine className="text-gray-400 text-lg" />
                                )}
                                <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Coluna Direita: Mapa Interativo do Google Maps */}
                    <div className="lg:col-span-5">
                        <div className="w-full h-80 sm:h-96 lg:h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                            <iframe
                                title={`Mapa de localização - ${point.name}`}
                                src={googleMapsEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
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
