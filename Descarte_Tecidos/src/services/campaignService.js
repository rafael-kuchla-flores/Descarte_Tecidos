import api from './api'
import collectionPointService from './collectionPointService'

// Campanhas mockadas com fidelidade ao design do projeto
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: 'Campanha do Agasalho 2026',
    startDate: '01/06/2026',
    endDate: '30/08/2026',
    status: 'Ativa',
    description: 'Doe roupas de inverno em bom estado e ajude quem mais precisa neste inverno.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    steps: [
      {
        number: 1,
        title: 'Separe as roupas',
        description: 'Selecione roupas de inverno em bom estado.',
      },
      {
        number: 2,
        title: 'Encontre um ponto',
        description: 'Veja os pontos de coleta participantes abaixo.',
      },
      {
        number: 3,
        title: 'Faça a doação',
        description: 'Leve suas roupas ao ponto de coleta escolhido.',
      },
    ],
    // IDs dos pontos de coleta que participam desta campanha
    pointIds: [1, 2, 3],
  },
  {
    id: 2,
    title: 'Doe e Recicle',
    startDate: '15/03/2026',
    endDate: '15/06/2026',
    status: 'Ativa',
    description: 'Contribua com tecidos e resíduos têxteis para reciclagem e fortalecimento da economia circular.',
    image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=1200&q=80',
    steps: [
      {
        number: 1,
        title: 'Separe os tecidos',
        description: 'Junte retalhos, sobras e roupas desgastadas.',
      },
      {
        number: 2,
        title: 'Consulte os centros',
        description: 'Localize os postos com foco em reciclagem têxtil.',
      },
      {
        number: 3,
        title: 'Destine corretamente',
        description: 'Entregue o material para ser reaproveitado.',
      },
    ],
    pointIds: [2, 3],
  },
  {
    id: 3,
    title: 'Natal Solidário',
    startDate: '01/10/2026',
    endDate: '25/12/2026',
    status: 'Em Breve',
    description: 'Doe roupas, agasalhos e cobertores para levar carinho e conforto a centenas de famílias no final de ano.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    steps: [
      {
        number: 1,
        title: 'Separe as doações',
        description: 'Separe agasalhos, cobertores e roupas limpas.',
      },
      {
        number: 2,
        title: 'Escolha uma ONG parceira',
        description: 'Consulte os pontos de entrega voluntária.',
      },
      {
        number: 3,
        title: 'Entregue sua doação',
        description: 'Faça o Natal de uma família mais acolhedor.',
      },
    ],
    pointIds: [1, 4],
  },
]

// Normalizador: padroniza a resposta da API (ou do mock) para que o front nunca quebre
const normalizeCampaign = (campaign) => {
  if (!campaign) return null

  const stepsDefault = [
    {
      number: 1,
      title: 'Separe as roupas',
      description: 'Selecione roupas e tecidos em bom estado.',
    },
    {
      number: 2,
      title: 'Encontre um ponto',
      description: 'Veja os pontos de coleta participantes abaixo.',
    },
    {
      number: 3,
      title: 'Faça a doação',
      description: 'Leve suas doações ao ponto de coleta escolhido.',
    },
  ]

  // Normaliza IDs dos pontos participantes
  let pointIds = [1, 2, 3]
  if (Array.isArray(campaign.pointIds) && campaign.pointIds.length > 0) {
    pointIds = campaign.pointIds
  } else if (Array.isArray(campaign.pontosColeta)) {
    pointIds = campaign.pontosColeta.map((p) => (typeof p === 'object' ? p.id : p))
  }

  return {
    id: campaign.id,
    title: campaign.titulo || campaign.title || 'Campanha Solidária',
    startDate: campaign.dataInicio || campaign.startDate || '01/06/2026',
    endDate: campaign.dataFinal || campaign.endDate || '30/08/2026',
    status: campaign.status || 'Ativa',
    description:
      campaign.descricao ||
      campaign.description ||
      'Participe desta campanha e ajude a transformar vidas através do descarte consciente.',
    image:
      campaign.imagem ||
      campaign.image ||
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    steps: Array.isArray(campaign.steps) && campaign.steps.length > 0 ? campaign.steps : stepsDefault,
    pointIds,
  }
}

// 1. Obter todas as campanhas
const getCampaigns = async () => {
  try {
    const data = await api('/campaigns', { method: 'GET' })
    const list = Array.isArray(data) ? data : data?.content || []
    if (list.length > 0) {
      return list.map(normalizeCampaign)
    }
    return MOCK_CAMPAIGNS.map(normalizeCampaign)
  } catch (error) {
    console.warn('API de campanhas indisponível ou necessita autenticação. Usando dados locais:', error)
    return MOCK_CAMPAIGNS.map(normalizeCampaign)
  }
}

// 2. Obter campanha específica por ID
const getCampaignById = async (id) => {
  try {
    const data = await api(`/campaigns/${id}`, { method: 'GET' })
    if (data && data.id) {
      return normalizeCampaign(data)
    }
  } catch (error) {
    console.warn(`Não foi possível buscar a campanha ${id} na API. Usando dados locais:`, error)
  }

  // Fallback: busca no mock local
  const found = MOCK_CAMPAIGNS.find((c) => String(c.id) === String(id))
  return found ? normalizeCampaign(found) : normalizeCampaign(MOCK_CAMPAIGNS[0])
}

// 3. Cruzar campanha com os Pontos de Coleta reais
const getParticipatingPoints = async (campaign) => {
  if (!campaign) return []

  try {
    const allPoints = await collectionPointService.getCollectionPoints()
    if (!campaign.pointIds || campaign.pointIds.length === 0) {
      return allPoints.slice(0, 3) // Se não tiver especificado, pega os 3 primeiros
    }

    const filtered = allPoints.filter((point) =>
      campaign.pointIds.some((pId) => String(pId) === String(point.id))
    )

    return filtered.length > 0 ? filtered : allPoints.slice(0, 3)
  } catch (error) {
    console.error('Erro ao cruzar pontos participantes:', error)
    return collectionPointService.MOCK_POINTS.slice(0, 3)
  }
}

export default {
  getCampaigns,
  getCampaignById,
  getParticipatingPoints,
  MOCK_CAMPAIGNS,
}
