
import api from './api';

// These endpoints must be confirmed with the backend team.
const CASHBACK_ENDPOINTS = {
  balance: null,
  transactions: null,
};

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

const getBalance = async () => {
  if (!CASHBACK_ENDPOINTS.balance) {
    return {
      available: false,
      balance: null,
    };
  }

  const response = await api(CASHBACK_ENDPOINTS.balance, {
    method: 'GET',
  });

  return {
    available: true,
    balance: normalizeBalance(response),
  };
};

const getTransactions = async () => {
  if (!CASHBACK_ENDPOINTS.transactions) {
    return {
      available: false,
      transactions: [],
    };
  }

  const response = await api(CASHBACK_ENDPOINTS.transactions, {
    method: 'GET',
  });

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

const cashbackService = {
  getBalance,
  getTransactions,
};

export default cashbackService;
