import React from 'react'
import Header from '../../../components/header/Header'
import CampaignCard from '../../../components/CampaignCard/CampaignCard'
import Footer from '../../../components/footer/Footer'

const Campaigns = () => {

  const campaigns = [
    {
      id: 1,
      image: undefined,
      startDate: '30/08/2026',
      endDate: '30/09/2026',
      status: 'Ativa',
      title: 'Campanha do Agasalho 2026',
      description:
        'Participe da nossa campanha de doação de agasalhos e ajude a aquecer o inverno de quem mais precisa.',
    },
    {
      id: 2,
      image: undefined,
      startDate: '10/09/2026',
      endDate: '12/10/2026',
      status: 'Pausada',
      title: 'Arrecadação de Alimentos',
      description: 'Contribua com alimentos não perecíveis para montar cestas básicas destinadas a famílias em situação de vulnerabilidade.',
    },
    {
      id: 3,
      image: undefined,
      startDate: '01/10/2026',
      endDate: '25/12/2026',
      status: 'Em Breve',
      title: 'Natal Solidário',
      description: 'Doe brinquedos novos ou em bom estado e faça a alegria de centenas de crianças neste Natal.',
    },
    {
      id: 3,
      image: undefined,
      startDate: '01/10/2026',
      endDate: '25/12/2026',
      status: 'Em Breve',
      title: 'Natal Solidário',
      description: 'Doe brinquedos novos ou em bom estado e faça a alegria de centenas de crianças neste Natal.',
    }
  ]

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