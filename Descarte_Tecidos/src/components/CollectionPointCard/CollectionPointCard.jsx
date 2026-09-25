import { useState } from 'react'
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
    const [isFavorite, setIsFavorite] = useState(false)
    const Icon = ICONS[point.iconType] || RiBuildingLine

    const handleFavoriteClick = (e) => {
        e.stopPropagation() // Impede de selecionar o card ao apenas favoritar
        setIsFavorite(!isFavorite)
    }

    return (
        <div
            onClick={() => onSelect && onSelect(point)}
            className={`rounded-xl p-5 transition-all duration-200 cursor-pointer border ${isSelected
                    ? 'bg-emerald-50/30 border-[#153D2C] ring-2 ring-[#153D2C]/20 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
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

                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase ${point.status === 'PAUSADO'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                    }`}>
                    {point.status === 'PAUSADO' ? 'Indisponível' : 'Recebendo'}
                </span>

                <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                >
                    {isFavorite ? (
                        <RiHeartFill className="text-xl text-red-500" />
                    ) : (
                        <RiHeartLine className="text-xl" />
                    )}
                </button>
            </div>

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
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${isSelected ? 'text-[#153D2C] font-semibold' : 'text-gray-500'
                    }`}>
                    <RiMapPinLine className={isSelected ? 'text-[#153D2C]' : 'text-gray-400'} />
                    {isSelected ? 'Destacado no mapa' : 'Clique para ver no mapa'}
                </span>

                <Link
                    to={`/pontos-de-coleta/${point.id}`}
                    onClick={(e) => e.stopPropagation()} // Impede o clique de ser absorvido pelo card
                    className="text-green-800 font-semibold text-xs inline-flex items-center gap-1 hover:underline"
                >
                    Ver detalhes <RiArrowRightLine />
                </Link>
            </div>
        </div>
    )
}

export default CollectionPointCard
