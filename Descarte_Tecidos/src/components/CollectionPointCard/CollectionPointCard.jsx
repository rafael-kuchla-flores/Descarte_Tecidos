import { Link } from 'react-router-dom'
import { RiHeartLine, RiTimeLine, RiArrowRightLine, RiBuildingLine, RiRecycleLine, RiStore2Line, RiLeafLine } from 'react-icons/ri'


const ICONS = {
    building: RiBuildingLine,
    recycle: RiRecycleLine,
    factory: RiStore2Line,
    leaf: RiLeafLine,
}

function CollectionPointCard({ point }) {
    const Icon = ICONS[point.iconType] || RiBuildingLine

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            {/* Linha do topo: ícone + nome + coração */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="text-xl text-gray-700" />
                    <span className="font-bold text-gray-900">{point.name}</span>
                </div>
                <RiHeartLine className="text-gray-400 hover:text-red-500 cursor-pointer" />
            </div>

            {/* Cidade + distância */}
            <div className="mt-1">
                <span className="text-sm text-gray-500">
                    {point.city} • {point.distance}
                </span>
            </div>

            {/* Endereço */}
            <div className="mt-1">
                <span className="text-base text-gray-800">{point.address}</span>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                <RiTimeLine />
                <span>{point.hours}</span>
            </div>

            {/* Link de detalhes */}
            <div className="mt-3 text-right">
                <Link
                    to={`/pontos-de-coleta/${point.id}`}
                    className="text-green-800 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                    Ver detalhes <RiArrowRightLine />
                </Link>
            </div>
        </div>
    )
}

export default CollectionPointCard

