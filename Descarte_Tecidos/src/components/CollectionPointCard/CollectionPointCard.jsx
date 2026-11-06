import { useFavorites, COLLECTION_POINT_FAVORITES_KEY } from '../../hooks/useFavorites'
import { Link } from 'react-router-dom'
import {
    RiHeartLine,
    RiHeartFill,
    RiTimeLine,
    RiArrowRightLine,
    RiBuildingLine,
    RiRecycleLine,
    RiStore2Line,
    RiLeafLine,
    RiMapPinLine
} from 'react-icons/ri'

const ICONS = {
    building: RiBuildingLine,
    recycle: RiRecycleLine,
    factory: RiStore2Line,
    leaf: RiLeafLine,
}

function CollectionPointCard({ point, isSelected = false, onSelect }) {
    const { isFavorite, toggleFavorite, favoriteError, loadingFavorites, favoritesReady, savingFavorite } = useFavorites(COLLECTION_POINT_FAVORITES_KEY)
    const saved = isFavorite(point.id)
    const status = String(point.status || '').toUpperCase()
    const isAvailable = status === 'ATIVO' || status === 'ACTIVE'
    const isPending = status === 'PENDENTE' || status === 'PENDING'
    const Icon = ICONS[point.iconType] || RiBuildingLine

    const handleFavoriteClick = (e) => {
        e.stopPropagation() // Impede de selecionar o card ao apenas favoritar
        void toggleFavorite(point.id)
    }

    return (
        <div
            className={`rounded-xl border p-5 transition-all duration-200 ${isSelected
                    ? 'border-[#153D2C] bg-emerald-50/30 shadow-md ring-2 ring-[#153D2C]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
        >
            {/* Linha do topo: ícone + nome + badge de selecionado + coração */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#153D2C] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        <Icon className="text-xl" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-base leading-snug">{point.name}</h2>
                        <span className="text-xs text-gray-500">
                            {point.city} • {point.distance}
                        </span>
                    </div>
                </div>

                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : isPending
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-amber-50 text-amber-700'
                    }`}>
                    {isAvailable ? 'Recebendo' : isPending ? 'Pendente' : 'Indisponível'}
                </span>

                <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title={saved ? 'Remover dos favoritos' : 'Favoritar'}
                    aria-label={saved ? `Remover ${point.name} dos favoritos` : `Favoritar ${point.name}`}
                    aria-pressed={saved}
                    disabled={loadingFavorites || !favoritesReady || savingFavorite}
                >
                    {saved ? (
                        <RiHeartFill className="text-xl text-red-500" />
                    ) : (
                        <RiHeartLine className="text-xl" />
                    )}
                </button>
            </div>

            {favoriteError && <p role="alert" className="mt-2 text-xs text-red-700">{favoriteError}</p>}

            {/* Endereço */}
            <div className="mt-3">
                <span className="text-sm text-gray-700 font-medium">{point.address}</span>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs">
                <RiTimeLine className="text-gray-400 text-sm shrink-0" />
                <span>{point.hours}</span>
            </div>

            {/* Rodapé do Card: Ação de ver no mapa + Link de detalhes */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => onSelect?.(point)}
                    aria-pressed={isSelected}
                    className={`inline-flex min-h-10 items-center gap-1 rounded px-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153D2C] ${isSelected ? 'text-[#153D2C]' : 'text-gray-600 hover:text-[#153D2C]'}`}
                >
                    <RiMapPinLine aria-hidden="true" />
                    {isSelected ? 'Destacado no mapa' : 'Destacar no mapa'}
                </button>

                <Link
                    to={`/pontos-de-coleta/${point.id}`}
                    className="text-green-800 font-semibold text-xs inline-flex items-center gap-1 hover:underline"
                >
                    Ver detalhes <RiArrowRightLine />
                </Link>
            </div>
        </div>
    )
}

export default CollectionPointCard
