
import collectionPointService from './collectionPointService'
import imagemTecidos from '../assets/images/hero-fabrics.jpg'

// Campanhas demonstrativas do EcoTecidos
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: 'Campanha do Agasalho 2026',
    startDate: '01/06/2026',
    endDate: '30/08/2026',
    status: 'Encerrada',
    description:
      'Doe roupas de inverno em bom estado e contribua com o reaproveitamento de peças e a solidariedade.',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    steps: [
      {
        number: 1,
        title: 'Separe as roupas',
        description: 'Selecione roupas de inverno limpas e em bom estado.',
      },
      {
        number: 2,
        title: 'Encontre um ponto',
        description: 'Consulte os pontos de coleta participantes.',
      },
      {
        number: 3,
        title: 'Faça a doação',
        description: 'Entregue as roupas no local escolhido.',
      },
    ],
    pointIds: [1, 2, 3],
  },

  {
    id: 2,
    title: 'Doe e Recicle',
    startDate: '15/03/2026',
    endDate: '15/06/2026',
    status: 'Encerrada',
    description:
      'Contribua com tecidos e resíduos têxteis para reciclagem e fortalecimento da economia circular.',

    // Imagem local do próprio projeto, substituindo a foto de COVID
    image: imagemTecidos,

    steps: [
      {
        number: 1,
        title: 'Separe os tecidos',
        description:
          'Separe roupas, retalhos e sobras de tecidos limpos e secos.',
      },
      {
        number: 2,
        title: 'Encontre um ponto de coleta',
        description:
          'Localize pontos que recebam os tipos de materiais que você deseja descartar.',
      },
      {
        number: 3,
        title: 'Destine corretamente',
        description:
          'Entregue os materiais no ponto escolhido e contribua para o reaproveitamento têxtil.',
      },
    ],
    pointIds: [2, 3],
  },

  {
    id: 3,
    title: 'Natal Solidário',
    startDate: '01/10/2026',
    endDate: '25/12/2026',
    status: 'Ativa',
    description:
      'Doe roupas, agasalhos e cobertores para promover solidariedade e incentivar o reaproveitamento de peças.',
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    steps: [
      {
        number: 1,
        title: 'Separe as doações',
        description:
          'Selecione agasalhos, cobertores e roupas limpas e em boas condições.',
      },
      {
        number: 2,
        title: 'Consulte os pontos de coleta',
        description:
          'Verifique os locais que recebem os materiais destinados à campanha.',
      },
      {
        number: 3,
        title: 'Entregue sua doação',
        description:
          'Leve as peças ao ponto escolhido e contribua com a iniciativa.',
      },
    ],
    pointIds: [1, 4],
  },
]

// Padroniza os dados das campanhas
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

  // Normaliza os IDs dos pontos participantes
  let pointIds = [1, 2, 3]

  if (Array.isArray(campaign.pointIds) && campaign.pointIds.length > 0) {
    pointIds = campaign.pointIds
  } else if (Array.isArray(campaign.pontosColeta)) {
    pointIds = campaign.pontosColeta.map((p) =>
      typeof p === 'object' ? p.id : p
    )
  }

  return {
    id: campaign.id,

    title:
      campaign.titulo ||
      campaign.title ||
      'Campanha Solidária',

    startDate:
      campaign.dataInicio ||
      campaign.startDate ||
      '01/06/2026',

    endDate:
      campaign.dataFinal ||
      campaign.endDate ||
      '30/08/2026',

    status: campaign.status || 'Ativa',

    description:
      campaign.descricao ||
      campaign.description ||
      'Participe desta campanha e ajude a transformar vidas através do descarte consciente.',

    image:
      campaign.imagem ||
      campaign.image ||
      imagemTecidos,

    steps:
      Array.isArray(campaign.steps) && campaign.steps.length > 0
        ? campaign.steps
        : stepsDefault,

    pointIds,
  }
}

// Retorna todas as campanhas demonstrativas
const getCampaigns = async () => {
  return MOCK_CAMPAIGNS.map(normalizeCampaign)
}

// Retorna uma campanha pelo ID
const getCampaignById = async (id) => {
  const found = MOCK_CAMPAIGNS.find(
    (campaign) => String(campaign.id) === String(id)
  )

  return found ? normalizeCampaign(found) : null
}

// Relaciona campanhas aos pontos de coleta disponíveis
const getParticipatingPoints = async (campaign) => {
  if (!campaign) return []

  try {
    const allPoints =
      await collectionPointService.getCollectionPoints()

    if (!campaign.pointIds || campaign.pointIds.length === 0) {
      return allPoints.slice(0, 3)
    }

    const filtered = allPoints.filter((point) =>
      campaign.pointIds.some(
        (pId) => String(pId) === String(point.id)
      )
    )

    return filtered.length > 0
      ? filtered
      : allPoints.slice(0, 3)

  } catch (error) {
    console.error('Erro ao cruzar pontos participantes:', error)
    return []
  }
}

export default {
  getCampaigns,
  getCampaignById,
  getParticipatingPoints,
  MOCK_CAMPAIGNS,
}
