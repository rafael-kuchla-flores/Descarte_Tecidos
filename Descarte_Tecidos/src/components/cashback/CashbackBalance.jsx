
import { useCallback, useEffect, useState } from 'react';
import cashbackService from '../../services/cashbackService';

const CashbackBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [available, setAvailable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadBalance = useCallback(async (isActive) => {
    try {
      setLoading(true);
      setError('');

      const result = await cashbackService.getBalance();

      if (!isActive()) return;

      setAvailable(result.available);
      setBalance(result.balance);
    } catch (requestError) {
      if (!isActive()) return;

      setAvailable(false);
      setBalance(null);
      setError(
        requestError?.message ||
          'Não foi possível consultar seu cashback.'
      );
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    loadBalance(() => active);

    return () => {
      active = false;
    };
  }, [loadBalance, refreshKey]);

  const hasBalance =
    available &&
    typeof balance === 'number' &&
    Number.isFinite(balance);

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <section
      aria-labelledby="cashback-title"
      className="mt-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="cashback-title"
            className="text-xl font-bold text-gray-900"
          >
            Meu cashback
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Acompanhe os créditos recebidos pelos seus descartes.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            loading
              ? 'bg-gray-100 text-gray-700'
              : error
                ? 'bg-red-50 text-red-700'
                : available
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-amber-50 text-amber-800'
          }`}
        >
          {loading
            ? 'Carregando'
            : error
              ? 'Consulta indisponível'
              : available
                ? 'Consulta disponível'
                : 'Integração pendente'}
        </span>
      </div>

      <div className="mt-5 rounded-lg bg-emerald-50 p-5">
        <p className="text-sm font-medium text-gray-700">
          Saldo disponível
        </p>

        <p
          className="mt-2 text-2xl font-bold text-[#123C2C]"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading
            ? 'Consultando saldo...'
            : hasBalance
              ? balance.toLocaleString('pt-BR')
              : 'Saldo indisponível'}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!loading && !error && !available && (
        <p role="status" className="mt-4 text-sm text-gray-600">
          Seu saldo será exibido quando a consulta de cashback
          estiver disponível na API.
        </p>
      )}

      {!loading && !error && available && (
        <p className="mt-4 text-sm text-gray-600">
          Saldo consultado no servidor. Créditos e resgates
          dependem da confirmação das operações pelo Backend.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Os créditos e resgates são confirmados pelo servidor.
        </p>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || !available}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar saldo'}
        </button>
      </div>
    </section>
  );
};

export default CashbackBalance;
