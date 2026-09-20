import api from './api'

// Dados completos baseados no design oficial
const MOCK_POINTS = [
    {
        id: 1,
        name: 'ONG Mãos Solidárias',
        city: 'Recife - PE',
        distance: '2,3 km',
        address: 'Rua das Flores, 123 - Boa Viagem',
        hours: 'Seg. a Sex, 08h às 18h',
        phone: '(81) 99999-9999',
        description: 'Organização social que recebe doações de roupas, tecidos e calçados, destinando às famílias em situação de vulnerabilidade social.',
        materials: ['Roupas em bom estado', 'Tecidos em geral', 'Lençóis e toalhas', 'Calçados'],
        category: 'ong',
        iconType: 'building',
    },
    {
        id: 2,
        name: 'Instituto Verde Esperança',
        city: 'Recife - PE',
        distance: '4,8 km',
        address: 'Av. Recife, 500 - Imbiribeira',
        hours: 'Seg. a Sáb, 09h às 17h',
        phone: '(81) 98888-8888',
        description: 'Coleta e triagem especializada em retalhos e tecidos industriais para reciclagem e economia circular.',
        materials: ['Retalhos de tecidos', 'Algodão e Jeans', 'Uniformes usados'],
        category: 'reciclagem',
        iconType: 'recycle',
    },
    {
        id: 3,
        name: 'Centro de Reciclagem Têxtil',
        city: 'Jaboatão - PE',
        distance: '8,1 km',
        address: 'Rua da Liberdade, 210',
        hours: 'Seg. a Sex, 08h às 18h',
        phone: '(81) 97777-7777',
        description: 'Ponto voltado para transformação de resíduos têxteis em novos fios e enchimentos ecológicos.',
        materials: ['Sobras de confecção', 'Fios e tecidos sintéticos', 'Retalhos'],
        category: 'centro',
        iconType: 'factory',
    },
    {
        id: 4,
        name: 'Projeto Renovar',
        city: 'Olinda - PE',
        distance: '12,4 km',
        address: 'Rua do Sol, 45 - Carmo',
        hours: 'Seg. a Sex, 09h às 16h',
        phone: '(81) 96666-6666',
        description: 'Iniciativa comunitária que apoia costureiras locais com doações de tecidos para oficinas de artesanato.',
        materials: ['Tecidos coloridos', 'Linhas e aviamentos', 'Roupas para customização'],
        category: 'projeto',
        iconType: 'leaf',
    },
]

// Função adaptadora: padroniza os campos para o Card e a Busca não quebrarem
const normalizePoint = (point) => {
    // Transforma materiais em array caso o backend envie como string separada por vírgula
    let materialsList = []
    if (Array.isArray(point.materials)) {
        materialsList = point.materials
    } else if (typeof point.materiais === 'string') {
        materialsList = point.materiais.split(',').map((m) => m.trim())
    } else {
        materialsList = ['Tecidos em geral', 'Roupas em bom estado']
    }

    return {
        id: point.id,
        name: point.nome || point.name || 'Ponto de Coleta',
        city: point.cidade ? `${point.cidade}${point.bairro ? ` - ${point.bairro}` : ''}` : (point.city || 'Recife - PE'),
        address: point.endereco || point.address || 'Endereço não informado',
        hours: point.horario || point.hours || 'Horário comercial',
        distance: point.distance || 'Ponto cadastrado',
        phone: point.telefone || point.phone || '(81) 99999-9999',
        description: point.descricao || point.description || 'Ponto de arrecadação e destinação consciente de resíduos têxteis.',
        materials: materialsList,
        category: point.category || 'ong',
        iconType: point.iconType || 'recycle',
        status: point.status || 'ATIVO',
    }
}

const getCollectionPoints = async () => {
    try {
        const data = await api('/collect-points', { method: 'GET' })
        const list = Array.isArray(data) ? data : data?.content || []

        if (list.length > 0) {
            const activePoints = list.filter((p) => !p.status || p.status === 'ATIVO')
            return (activePoints.length > 0 ? activePoints : list).map(normalizePoint)
        }

        return MOCK_POINTS.map(normalizePoint)
    } catch (error) {
        console.warn('Backend sem pontos ou sem permissão de visitante. Usando dados locais:', error)
        return MOCK_POINTS.map(normalizePoint)
    }
}

const getPointById = async (id) => {
    try {
        const data = await api(`/collect-points/${id}`, { method: 'GET' })
        if (data && data.id) {
            return normalizePoint(data)
        }
    } catch (error) {
        console.warn(`Não foi possível buscar o ponto ${id} na API. Buscando localmente.`)
    }

    // Fallback: procura na lista local
    const found = MOCK_POINTS.find((p) => String(p.id) === String(id))
    return found ? normalizePoint(found) : null
}

export default {
    getCollectionPoints,
    getPointById,
    MOCK_POINTS,
}
