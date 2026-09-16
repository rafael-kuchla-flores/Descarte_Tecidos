import { useState, useEffect } from 'react'
import { RiSearchLine, RiMapPinLine } from 'react-icons/ri'
import Header from '../../../components/Header/Header'
import CollectionPointCard from '../../../components/CollectionPointCard/CollectionPointCard'
import collectionPointService from '../../../services/collectionPointService'

const CollectionPoints = () => {
  const [points, setPoints] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [filteredPoints, setFilteredPoints] = useState([])

  // Busca os pontos da API ao carregar a página
  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true)
      const data = await collectionPointService.getCollectionPoints()
      setPoints(data)
      setFilteredPoints(data)
      setLoading(false)
    }
    fetchPoints()
  }, [])

  // Filtra os pontos conforme o usuário digita na busca
  const handleSearch = () => {
    const term = search.toLowerCase().trim()
    if (!term) {
      setFilteredPoints(points)
      return
    }
    const result = points.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
    )
    setFilteredPoints(result)
  }

  // Permite buscar ao apertar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

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

        {/* Resultado + Layout de duas colunas */}
        {loading ? (
          <p className="text-center text-gray-500">Carregando pontos de coleta...</p>
        ) : (
          <>
            <p className="text-sm text-green-800 font-medium mb-4">
              {filteredPoints.length} {filteredPoints.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}
            </p>

            <div className="flex gap-6">
              {/* Coluna esquerda: lista de cards */}
              <div className="flex-1 flex flex-col gap-4">
                {filteredPoints.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum ponto encontrado para essa busca.</p>
                ) : (
                  filteredPoints.map((point) => (
                    <CollectionPointCard key={point.id} point={point} />
                  ))
                )}
              </div>

              {/* Coluna direita: painel de mapa (placeholder visual) */}
              <div className="hidden lg:flex lg:w-96 flex-col items-center justify-center bg-gray-100 rounded-xl border border-gray-200 p-6 text-center gap-3">
                <RiMapPinLine className="text-5xl text-[#153D2C]" />
                <h2 className="font-bold text-gray-800 text-lg">Mapa interativo</h2>
                <p className="text-sm text-green-700 font-medium">
                  {filteredPoints.length} pontos de coleta na região
                </p>
                <ul className="text-sm text-gray-600 text-left w-full mt-2 space-y-1">
                  {filteredPoints.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <RiMapPinLine className="text-red-500 shrink-0" />
                      {p.name} — {p.distance}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default CollectionPoints
