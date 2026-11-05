
import api from './api';

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

// Return a compatible balance for Profile and Wallet.
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

// Retrieve the paginated cashback history.
const getHistory = async (params = {}) =>
  api('/cashback/history', { params });

// Preserve the original transaction interface.
const getTransactions = async (params = {}) => {
  const response = await getHistory(params);

  const transactions = Array.isArray(response)
    ? response
    : response?.content ?? response?.transactions;

  if (!Array.isArray(transactions)) {
    throw new Error('O histórico retornado pela API é inválido.');
  }

  return {
    available: true,
    transactions,
  };
};

// Redeem cashback points.
const redeem = async (request) =>
  api('/cashback/redeem', {
    method: 'POST',
    body: JSON.stringify(request),
  });

// Retrieve the authenticated user's disposals.
const getMyDisposals = async (params = {}) =>
  api('/disposals/my-disposals', { params });

// Register a new disposal.
const createDisposal = async (request) =>
  api('/disposals', {
    method: 'POST',
    body: JSON.stringify(request),
  });

// Retrieve available cloth types.
const getPublicClothTypes = async () =>
  api('/cloth-types');

// Retrieve pending disposals for a collection point.
const getPendingDisposals = async (
  collectionPointId,
  params = {}
) =>
  api(
    `/disposals/collection-point/${collectionPointId}/pending`,
    { params }
  );

// Confirm a disposal.
const confirmDisposal = async (id) =>
  api(`/disposals/${id}/confirm`, {
    method: 'PATCH',
  });

// Reject a disposal with justification.
const rejectDisposal = async (id, justification) =>
  api(`/disposals/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ justification }),
  });

// Retrieve the current cashback rule.
const getCurrentRule = async () =>
  api('/admin/cashback-rules/current');

// Update the points awarded per kilogram.
const updatePointsPerKg = async (pointsPerKg) =>
  api('/admin/cashback-rules/points-per-kg', {
    method: 'PUT',
    body: JSON.stringify({ pointsPerKg }),
  });

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
