import api from './api'

// Dados iniciais baseados no design (usados caso o endpoint da API ainda não exista ou caia)
const MOCK_POINTS = [
    {
        id: 1,
        name: 'ONG Mãos Solidárias',
        city: 'Recife - PE',
        distance: '2,3 km',
        address: 'Rua das Flores, 123 - Boa Viagem',
        hours: 'Seg. a Sex, 08h às 18h',
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
        category: 'projeto',
        iconType: 'leaf',
    },
]

// Função adaptadora: padroniza os campos para o Card e a Busca não quebrarem
const normalizePoint = (point) => ({
    id: point.id,
    name: point.nome || point.name || 'Ponto de Coleta',
    city: point.cidade ? `${point.cidade}${point.bairro ? ` - ${point.bairro}` : ''}` : (point.city || 'Recife - PE'),
    address: point.endereco || point.address || 'Endereço não informado',
    hours: point.horario || point.hours || 'Horário comercial',
    distance: point.distance || 'Ponto cadastrado',
    category: point.materiais || point.category || 'Geral',
    iconType: point.iconType || 'recycle',
    status: point.status || 'ATIVO',
})

const getCollectionPoints = async () => {
    try {
        // 1. Chama a rota correta do backend
        const data = await api('/collect-points', { method: 'GET' })

        // 2. Trata tanto array direto quanto resposta paginada do Spring Boot (data.content)
        const list = Array.isArray(data) ? data : data?.content || []

        if (list.length > 0) {
            // Filtra apenas os pontos que estão com status ATIVO (ou sem status definido)
            const activePoints = list.filter((p) => !p.status || p.status === 'ATIVO')
            return (activePoints.length > 0 ? activePoints : list).map(normalizePoint)
        }

        // Se o banco estiver vazio, usa os dados de contingência
        return MOCK_POINTS.map(normalizePoint)
    } catch (error) {
        console.warn('Backend sem pontos ou sem permissão de visitante. Usando dados locais:', error)
        return MOCK_POINTS.map(normalizePoint)
    }
}

export default {
    getCollectionPoints,
    MOCK_POINTS,
}

