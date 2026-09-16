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

const getCollectionPoints = async () => {
    try {
        // Tenta buscar no backend no endpoint padrão
        const data = await api('/collection-points', { method: 'GET' })
        return data && data.length > 0 ? data : MOCK_POINTS
    } catch (error) {
        console.warn('Backend ainda sem endpoint de pontos de coleta. Usando dados locais:', error)
        return MOCK_POINTS
    }
}

export default {
    getCollectionPoints,
    MOCK_POINTS,
}
