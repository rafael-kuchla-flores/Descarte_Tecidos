
import { useState } from 'react';

const CashbackBalance = () => {
  const [balance] = useState(null);

  const hasBalance =
    typeof balance === 'number' &&
    Number.isFinite(balance);

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

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          Integração pendente
        </span>
      </div>

      <div className="mt-5 rounded-lg bg-emerald-50 p-5">
        <p className="text-sm font-medium text-gray-700">
          Saldo disponível
        </p>

        <p
          className="mt-2 text-2xl font-bold text-[#123C2C]"
          aria-live="polite"
        >
          {hasBalance
            ? balance.toLocaleString('pt-BR')
            : 'Saldo indisponível'}
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Seu saldo será exibido quando a consulta de cashback
        estiver disponível na API.
      </p>

      <p className="mt-2 text-xs text-gray-500">
        Os créditos e resgates são confirmados pelo servidor.
      </p>
    </section>
  );
};

export default CashbackBalance;
