
import api, { getAllPages } from './api';

// ==========================================
// NORMALIZAÇÃO DO SALDO
// ==========================================

const normalizeBalance = (response) => {
  const rawBalance =
    typeof response === 'number'
      ? response
      : response?.balance ?? response?.availableBalance;

  if (
    rawBalance === null ||
    rawBalance === undefined ||
    rawBalance === ''
  ) {
    throw new Error('A API não retornou um saldo válido.');
  }

  const balance = Number(rawBalance);

  if (!Number.isFinite(balance)) {
    throw new Error('O saldo retornado pela API é inválido.');
  }

  return balance;
};

// ==========================================
// SALDO DA CARTEIRA
// ==========================================

// Retorna o saldo de cashback do usuário.
const getBalance = async () => {
  const response = await api('/cashback/balance', {
    method: 'GET',
  });

  return {
    ...(typeof response === 'object' && response !== null
      ? response
      : {}),
    available: true,
    balance: normalizeBalance(response),
    updatedAt: response?.updatedAt ?? null,
  };
};

// ==========================================
// HISTÓRICO DE TRANSAÇÕES
// ==========================================

// Consulta o histórico paginado de cashback.
const getHistory = async (params = {}) =>
  api('/cashback/history', {
    method: 'GET',
    params,
  });

// Mantém o formato utilizado pelos componentes
// de perfil e carteira.
const getTransactions = async (params = {}) => {
  const response = await getHistory(params);

  const transactions = Array.isArray(response)
    ? response
    : response?.content ?? response?.transactions;

  if (!Array.isArray(transactions)) {
    throw new Error(
      'O histórico retornado pela API é inválido.'
    );
  }

  return {
    available: true,
    transactions,
  };
};

// ==========================================
// RESGATE DE CASHBACK
// ==========================================

// Resgata os pontos disponíveis na carteira.
const redeem = async (request) =>
  api('/cashback/redeem', {
    method: 'POST',
    body: JSON.stringify(request),
  });

// ==========================================
// DESCARTES DE TECIDOS
// ==========================================

// Consulta os descartes registrados pelo usuário.
const getMyDisposals = async (params = {}) =>
  api('/disposals/my-disposals', {
    method: 'GET',
    params,
  });

// Registra um novo descarte.
const createDisposal = async (request) =>
  api('/disposals', {
    method: 'POST',
    body: JSON.stringify(request),
  });

// ==========================================
// CATÁLOGO COMPLETO DE TIPOS DE TECIDO
// ==========================================

// Recupera todas as páginas do catálogo de tecidos
// cadastrado no backend.
//
// Antes, apenas a primeira página era carregada.
// Agora, todos os tipos podem ser recuperados,
// respeitando a paginação da API.

const getPublicClothTypes = async () => {
  return getAllPages('/cloth-types', {
    size: 100,
  });
};

// ==========================================
// GERENCIAMENTO DE DESCARTES
// ==========================================

// Consulta descartes pendentes de um ponto de coleta.
const getPendingDisposals = async (
  collectionPointId,
  params = {}
) =>
  api(
    `/disposals/collection-point/${collectionPointId}/pending`,
    {
      method: 'GET',
      params,
    }
  );

// Confirma um descarte recebido.
const confirmDisposal = async (id) =>
  api(`/disposals/${id}/confirm`, {
    method: 'PATCH',
  });

// Rejeita um descarte com justificativa.
const rejectDisposal = async (id, justification) =>
  api(`/disposals/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({
      justification,
    }),
  });

// ==========================================
// REGRAS DE CASHBACK
// ==========================================

// Consulta a regra atual de cashback.
const getCurrentRule = async () =>
  api('/admin/cashback-rules/current', {
    method: 'GET',
  });

// Atualiza a quantidade de pontos por quilograma.
const updatePointsPerKg = async (pointsPerKg) =>
  api('/admin/cashback-rules/points-per-kg', {
    method: 'PUT',
    params: {
      newPointsPerKg: pointsPerKg,
    },
  });

// ==========================================
// EXPORTAÇÃO DOS SERVIÇOS
// ==========================================

const cashbackService = {
  getBalance,
  getHistory,
  getTransactions,
  redeem,
  getMyDisposals,
  createDisposal,
  getPublicClothTypes,
  getPendingDisposals,
  confirmDisposal,
  rejectDisposal,
  getCurrentRule,
  updatePointsPerKg,
};

export default cashbackService;
