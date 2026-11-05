import { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import CampaignCard from '../../../components/CampaignCard/CampaignCard'
import Footer from '../../../components/Footer/Footer'
import campaignService from '../../../services/campaignService'

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await campaignService.getCampaigns()
        if (active) setCampaigns(Array.isArray(data) ? data : [])
      } catch (requestError) {
        if (active) {
          setCampaigns([])
          setError(requestError.message || 'Não foi possível carregar as campanhas.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCampaigns()
    return () => { active = false }
  }, [reloadKey])

  return (
    <>
      <Header />
      <main className="container mx-auto flex min-h-[65vh] flex-col items-center px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-center text-3xl font-bold text-green-900 sm:text-4xl">Campanhas</h1>
        <p className="mb-8 text-center text-gray-700">Participe das nossas campanhas de doação e faça a diferença.</p>

        {loading ? (
          <p role="status" className="py-12 text-center text-gray-600">Carregando campanhas...</p>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100">Tentar novamente</button>
          </div>
        ) : campaigns.length === 0 ? (
          <p role="status" className="py-12 text-center text-gray-600">Nenhuma campanha disponível no momento.</p>
        ) : (
          <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {campaigns.map((campaign) => <CampaignCard key={campaign.id} {...campaign} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Campaigns
