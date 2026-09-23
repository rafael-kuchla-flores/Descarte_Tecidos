import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiRecycleLine,
  RiBuildingLine,
  RiStore2Line,
  RiLeafLine,
} from 'react-icons/ri'
import Header from '../../../components/Header/Header'
import Footer from '../../../components/footer/Footer'
import campaignService from '../../../services/campaignService'

// Ícones dinâmicos para os pontos de coleta participantes
const ICONS = {
  building: RiBuildingLine,
  recycle: RiRecycleLine,
  factory: RiStore2Line,
  leaf: RiLeafLine,
}

const CampaignDetail = () => {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [participatingPoints, setParticipatingPoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true)
      try {
        // 1. Busca os detalhes da campanha
        const campaignData = await campaignService.getCampaignById(id)
        setCampaign(campaignData)

        // 2. Busca e cruza os pontos de coleta que participam desta campanha
        if (campaignData) {
          const points = await campaignService.getParticipatingPoints(campaignData)
          setParticipatingPoints(points)
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes da campanha:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">
          <div className="animate-pulse space-y-4 max-w-lg mx-auto">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-6 text-sm text-gray-500">Carregando detalhes da campanha...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Campanha não encontrada</h2>
          <p className="text-gray-600 mb-6">A campanha que você está procurando não existe ou expirou.</p>
          <Link
            to="/campanhas"
            className="inline-flex items-center gap-2 text-green-900 font-semibold hover:underline"
          >
            <RiArrowLeftLine /> Voltar para a lista de campanhas
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Botão Voltar */}
        <Link
          to="/campanhas"
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-green-900 text-sm font-medium mb-8 transition-colors"
        >
          <RiArrowLeftLine className="text-base" /> Voltar
        </Link>

        {/* Bloco Superior: Informações + Imagem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          {/* Coluna Esquerda: Detalhes e Como Participar */}
          <div className="lg:col-span-7">
            {/* Header da Campanha: Período e Status */}
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 rounded bg-emerald-50 text-emerald-800">
                <RiRecycleLine className="text-lg text-emerald-700" />
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {campaign.startDate} a {campaign.endDate}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {campaign.status}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {campaign.title}
            </h1>

            {/* Descrição */}
            <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
              {campaign.description}
            </p>

            {/* Seção Como Participar */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Como participar
              </h2>

              <div className="space-y-4">
                {campaign.steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-[#153D2C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Imagem da Campanha */}
          <div className="lg:col-span-5">
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Bloco Inferior: Pontos Participantes */}
        <section className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Pontos participantes
            </h2>
            <Link
              to="/pontos-de-coleta"
              className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-green-900 transition-colors"
            >
              Ver todos os pontos →
            </Link>
          </div>

          {/* Grid de Cards dos Pontos Participantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {participatingPoints.map((point) => {
              const Icon = ICONS[point.iconType] || RiBuildingLine

              return (
                <Link
                  to={`/pontos-de-coleta/${point.id}`}
                  key={point.id}
                  className="p-5 rounded-2xl border border-gray-200/90 hover:border-green-800 hover:shadow-md transition-all duration-200 bg-white flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-[#153D2C] transition-colors leading-snug">
                      {point.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {point.city}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>{point.distance}</span>
                    <span className="text-[#153D2C] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver detalhes →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CampaignDetail
