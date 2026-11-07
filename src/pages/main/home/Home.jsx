import { getCampaignStatus } from '../../../utils/campaignPresentation'
import { useState, useEffect } from 'react'
import Header from '../../../components/Header/Header'
import Footer from '../../../components/Footer/Footer'
import { Link } from 'react-router-dom'
import {
  RiMapPinLine,
  RiRecycleLine,
  RiHeartFill,
  RiLeafLine,
  RiEarthLine,
  RiBuildingLine,
} from 'react-icons/ri'
import heroFabrics from '../../../assets/images/hero-fabrics.jpg'
import clothesImage from '../../../assets/images/image.png'
import collectionPointService from '../../../services/collectionPointService'
import campaignService from '../../../services/campaignService'

const Home = () => {
  const [nearbyPoints, setNearbyPoints] = useState([])
  const [featuredCampaign, setFeaturedCampaign] = useState(null)
  const [pointsError, setPointsError] = useState(false)

  useEffect(() => {
    let active = true
    const loadPoints = async () => {
      try {
        const points = await collectionPointService.getCollectionPoints({ size: 100 })
        if (active) setNearbyPoints(points.filter((point) => point.status === 'ATIVO').slice(0, 3))
      } catch (error) {
        console.warn('Não foi possível carregar os pontos de coleta:', error)
        if (active) setPointsError(true)
      }
    }
    const loadCampaign = async () => {
      try {
        const campaigns = await campaignService.getCampaigns()
        const activeCampaign = campaigns.find((campaign) => {
          return getCampaignStatus(campaign) === 'Ativa'
        })
        if (active && activeCampaign) setFeaturedCampaign(activeCampaign)
      } catch (error) {
        console.warn('Não foi possível carregar as campanhas:', error)
      }
    }
    loadPoints()
    loadCampaign()
    return () => { active = false }
  }, [])

  const pillars = [
    {
      id: 1,
      icon: <RiRecycleLine className="text-4xl text-green-600" />,
      title: 'Reduz o impacto ambiental',
      description: 'Diminui o lixo têxtil e a poluição do planeta.',
    },
    {
      id: 2,
      icon: <RiHeartFill className="text-4xl text-red-500" />,
      title: 'Transforma vidas',
      description: 'Suas doações aquecem quem mais precisa.',
    },
    {
      id: 3,
      icon: <RiLeafLine className="text-4xl text-green-600" />,
      title: 'Fortalece a economia circular',
      description: 'Tecidos podem ser reutilizados e reciclados.',
    },
    {
      id: 4,
      icon: <RiEarthLine className="text-4xl text-blue-500" />,
      title: 'Construímos um futuro mais consciente',
      description: 'Pequenas atitudes, grandes mudanças.',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-[#0f382c] grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Dê um novo destino para os seus tecidos.
            </h1>

            <p className="text-emerald-100 text-lg md:text-xl mt-4 mb-8">
              Juntos por uma moda mais consciente e um planeta mais sustentável.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/pontos-de-coleta" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#133e33] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <RiMapPinLine className="text-xl" aria-hidden="true" />
                Encontrar pontos de coleta
              </Link>

              <Link to="/como-funciona" className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Como funciona
              </Link>
            </div>
          </div>

          <div className="w-full h-full min-h-[300px] lg:min-h-[450px]">
            <img
              src={heroFabrics}
              alt="Amostras de tecidos coloridos"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {pillars.map((pillar) => (
                <div key={pillar.id} className="flex flex-col items-center">
                  <div className="mb-4">{pillar.icon}</div>
                  <h3 className="text-lg font-bold text-[#153D2C] mb-2">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#153D2C]">
                Pontos de coleta em destaque
              </h2>
              <Link
                to="/pontos-de-coleta"
                className="text-sm font-medium text-gray-500 hover:text-[#153D2C] transition-colors"
              >
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nearbyPoints.length === 0 ? (
                <p className="text-sm text-gray-400 col-span-full">{pointsError ? "Não foi possível consultar os pontos agora. Tente novamente mais tarde." : "Nenhum ponto de coleta ativo disponível no momento."}</p>
              ) : (
                nearbyPoints.map((point) => (
                    <Link
                      to={`/pontos-de-coleta/${point.id}`}
                      key={point.id}
                      className="p-5 rounded-2xl border border-gray-200/90 hover:border-[#153D2C] hover:shadow-sm transition-all duration-200 bg-white flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                        <RiBuildingLine className="text-2xl text-gray-700" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-[#153D2C] transition-colors leading-snug truncate">
                          {point.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{point.city}</p>
                        {point.distanceKm && (
                          <p className="text-xs text-gray-400 mt-1 font-medium">{point.distanceKm} km</p>
                        )}
                      </div>
                    </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#153D2C]">
                Campanhas em destaque
              </h2>
              <Link
                to="/campanhas"
                className="text-sm font-medium text-gray-500 hover:text-[#153D2C] transition-colors"
              >
                Ver todas
              </Link>
            </div>

            {featuredCampaign ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="overflow-hidden rounded-xl h-64 md:h-80">
                  <img src={clothesImage} alt={featuredCampaign.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-green-800">Campanha demonstrativa em destaque</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#153D2C] mt-2 mb-4">{featuredCampaign.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-6">{featuredCampaign.description}</p>
                  <Link to={`/campanhas/${featuredCampaign.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#153D2C] px-6 py-3 font-semibold text-white hover:bg-[#1e543d]">Saiba mais</Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8">
                <h3 className="text-xl font-semibold text-[#153D2C]">Faça parte da mudança</h3>
                <p className="mt-2 text-gray-700">Confira as campanhas cadastradas e descubra como contribuir com a reutilização de tecidos.</p>
                <Link to="/campanhas" className="mt-4 inline-flex rounded-full bg-[#153D2C] px-5 py-3 text-white">Explorar campanhas</Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home