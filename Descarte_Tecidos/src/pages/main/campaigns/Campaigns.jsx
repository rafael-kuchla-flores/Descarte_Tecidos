import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header/Header'
import CampaignCard from '../../../components/CampaignCard/CampaignCard'
import Footer from '../../../components/footer/Footer'
import campaignService from '../../../services/campaignService'

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns()
        setCampaigns(data)
      } catch (error) {
        console.error('Erro ao carregar campanhas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-12 flex flex-col items-center">

        <h1 className="text-4xl font-bold text-green-900 mb-2">
          Campanhas
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Participe das nossas campanhas de doação e faça a diferença.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
            />
          ))}

        </div>

      </main>
      <Footer />
    </>
  )
}

export default Campaigns