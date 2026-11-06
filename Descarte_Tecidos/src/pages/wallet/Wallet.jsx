import { useCallback, useEffect, useMemo, useState } from 'react'
import cashbackService from '../../services/cashbackService'
import collectionPointService from '../../services/collectionPointService'

const formatPoints = (value) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Number(value) || 0)

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Data indisponível' : date.toLocaleString('pt-BR')
}

const Wallet = () => {
  const [balance, setBalance] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [transactionPage, setTransactionPage] = useState(null)
  const [transactionFilter, setTransactionFilter] = useState('')
  const [disposals, setDisposals] = useState([])
  const [points, setPoints] = useState([])
  const [clothTypes, setClothTypes] = useState([])
  const [clothTypeWarning, setClothTypeWarning] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [savingDisposal, setSavingDisposal] = useState(false)
  const [savingRedeem, setSavingRedeem] = useState(false)
  const [disposalForm, setDisposalForm] = useState({
    collectionPointId: '',
    approximateWeightInKg: '',
    clothTypeIds: [],
  })
  const [redeemForm, setRedeemForm] = useState({ amount: '', description: '', partnerStore: '' })

  const loadData = useCallback(async (page = 0, filter = transactionFilter) => {
    setLoading(true)
    setError('')
    try {
      const [balanceResult, historyResult, disposalsResult] = await Promise.all([
        cashbackService.getBalance().catch((requestError) => {
          if (requestError.status === 404) return { balance: 0, updatedAt: null }
          throw requestError
        }),
        cashbackService.getHistory({ page, size: 20, ...(filter ? { filter } : {}) }),
        cashbackService.getMyDisposals({ page: 0, size: 20 }),
      ])
      setBalance(Number(balanceResult.balance) || 0)
      setUpdatedAt(balanceResult.updatedAt)
      setTransactions(historyResult.content || [])
      setTransactionPage(historyResult.page || null)
      setDisposals(disposalsResult.disposals?.content || disposalsResult.content || [])
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar sua carteira.')
    } finally {
      setLoading(false)
    }
  }, [transactionFilter])

  useEffect(() => {
    let active = true
    const loadFormOptions = async () => {
      const [pointsResult, typesResult] = await Promise.allSettled([
        collectionPointService.getCollectionPoints(),
        cashbackService.getPublicClothTypes(),
      ])
      if (!active) return

      if (pointsResult.status === 'fulfilled') {
        setPoints(pointsResult.value)
      } else {
        setError(pointsResult.reason?.message || 'Não foi possível carregar os pontos de coleta.')
      }

      if (typesResult.status === 'fulfilled') {
        setClothTypes(typesResult.value)
        setClothTypeWarning('')
      } else {
        setClothTypes([])
        setClothTypeWarning(
          'A lista de tipos de tecido não está disponível. O registro de descarte depende da liberação do endpoint /cloth-types pelo backend.'
        )
      }
    }
    void loadFormOptions()
    return () => { active = false }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => loadData())
  }, [loadData])

  const selectedPoint = points.find((point) => String(point.id) === disposalForm.collectionPointId)
  const acceptedTypes = useMemo(() => {
    if (!selectedPoint) return []
    const acceptedIds = selectedPoint.clothTypeIds || []
    return clothTypes.filter((type) =>
      acceptedIds.some((id) => Number(id) === Number(type.id))
      || (selectedPoint.acceptedClothTypes || []).some((accepted) =>
        (typeof accepted === 'string' ? accepted : accepted?.name) === type.name))
  }, [selectedPoint, clothTypes])

  const toggleClothType = (typeId, checked) => {
    setDisposalForm((current) => ({
      ...current,
      clothTypeIds: checked
        ? [...current.clothTypeIds, typeId]
        : current.clothTypeIds.filter((id) => Number(id) !== Number(typeId)),
    }))
  }

  const handleCreateDisposal = async (event) => {
    event.preventDefault()
    if (!disposalForm.clothTypeIds.length) {
      setError('Selecione pelo menos um tipo de tecido antes de registrar o descarte.')
      return
    }
    setSavingDisposal(true)
    setError('')
    setFeedback('')
    try {
      await cashbackService.createDisposal({
        collectionPointId: Number(disposalForm.collectionPointId),
        approximateWeightInKg: Number(disposalForm.approximateWeightInKg),
        clothTypeIds: disposalForm.clothTypeIds,
      })
      setDisposalForm({ collectionPointId: '', approximateWeightInKg: '', clothTypeIds: [] })
      setFeedback('Descarte registrado. O cashback será creditado após a confirmação pelo ponto de coleta.')
      await loadData()
    } catch (requestError) {
      setError(requestError.data?.fieldErrors?.map((item) => item.message).join(' ') || requestError.message || 'Não foi possível registrar o descarte.')
    } finally {
      setSavingDisposal(false)
    }
  }

  const handleRedeem = async (event) => {
    event.preventDefault()
    setSavingRedeem(true)
    setError('')
    setFeedback('')
    try {
      await cashbackService.redeem({
        amount: Number(redeemForm.amount),
        description: redeemForm.description.trim(),
        partnerStore: redeemForm.partnerStore.trim(),
      })
      setRedeemForm({ amount: '', description: '', partnerStore: '' })
      setFeedback('Resgate efetuado com sucesso.')
      await loadData()
    } catch (requestError) {
      setError(requestError.data?.fieldErrors?.map((item) => item.message).join(' ') || requestError.message || 'Não foi possível efetuar o resgate.')
    } finally {
      setSavingRedeem(false)
    }
  }

  const changeFilter = (value) => {
    setTransactions([])
    setTransactionPage(null)
    setTransactionFilter(value)
  }
  const changePage = (page) => loadData(page)

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Cashback e carteira</h1>
        <p className="mt-2 text-sm text-gray-600">Acompanhe seus pontos, descartes e resgates.</p>
      </header>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {clothTypeWarning && <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{clothTypeWarning}</p>}
      {feedback && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{feedback}</p>}

      <section className="rounded-2xl bg-[#123C2C] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm text-emerald-100">Saldo disponível</p>
        <p className="mt-2 text-4xl font-bold">{loading ? '...' : formatPoints(balance)} <span className="text-lg font-medium">pontos</span></p>
        <p className="mt-3 text-xs text-emerald-100/80">{updatedAt ? `Atualizado em ${formatDate(updatedAt)}` : 'Seus pontos aparecerão aqui após a confirmação de um descarte.'}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateDisposal} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Registrar descarte</h2>
            <p className="mt-1 text-sm text-gray-500">O ponto de coleta precisa confirmar o descarte para liberar os pontos.</p>
          </div>
          <label className="block text-sm font-semibold text-gray-700">
            Ponto de coleta
            <select required value={disposalForm.collectionPointId} onChange={(event) => setDisposalForm({ ...disposalForm, collectionPointId: event.target.value, clothTypeIds: [] })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal">
              <option value="">Selecione um ponto ativo</option>
              {points.filter((point) => point.status === 'ATIVO' || point.status === 'ACTIVE').map((point) => (
                <option key={point.id} value={point.id}>{point.name} · {point.city}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Peso aproximado (kg)
            <input required type="number" min="0.01" step="0.01" value={disposalForm.approximateWeightInKg} onChange={(event) => setDisposalForm({ ...disposalForm, approximateWeightInKg: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
          </label>
          <fieldset>
            <legend className="text-sm font-semibold text-gray-700">Tipos de tecido</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {acceptedTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={disposalForm.clothTypeIds.includes(type.id)} onChange={(event) => toggleClothType(type.id, event.target.checked)} />
                  {type.name}
                </label>
              ))}
              {selectedPoint && acceptedTypes.length === 0 && <p className="text-sm text-gray-500">Este ponto não possui tecidos disponíveis para seleção.</p>}
            </div>
          </fieldset>
          <button type="submit" disabled={savingDisposal || !acceptedTypes.length || !disposalForm.clothTypeIds.length} className="rounded-lg bg-[#123C2C] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {savingDisposal ? 'Registrando...' : 'Registrar descarte'}
          </button>
        </form>

        <form onSubmit={handleRedeem} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Resgatar pontos</h2>
            <p className="mt-1 text-sm text-gray-500">O resgate é realizado imediatamente e descontado do saldo.</p>
          </div>
          <label className="block text-sm font-semibold text-gray-700">
            Quantidade de pontos
            <input required type="number" min="0.01" step="0.01" max={balance} value={redeemForm.amount} onChange={(event) => setRedeemForm({ ...redeemForm, amount: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Descrição
            <input required maxLength="200" value={redeemForm.description} onChange={(event) => setRedeemForm({ ...redeemForm, description: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Loja parceira
            <input required maxLength="120" value={redeemForm.partnerStore} onChange={(event) => setRedeemForm({ ...redeemForm, partnerStore: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
          </label>
          <button type="submit" disabled={savingRedeem || balance <= 0} className="rounded-lg border border-[#123C2C] px-4 py-2.5 text-sm font-semibold text-[#123C2C] disabled:cursor-not-allowed disabled:opacity-50">
            {savingRedeem ? 'Resgatando...' : 'Resgatar pontos'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Histórico da carteira</h2>
            <p className="mt-1 text-sm text-gray-500">Créditos de descartes confirmados e resgates realizados.</p>
          </div>
          <label className="text-sm font-medium text-gray-600">
            Tipo
            <select value={transactionFilter} onChange={(event) => changeFilter(event.target.value)} className="ml-2 rounded-lg border border-gray-300 px-3 py-2">
              <option value="">Todos</option>
              <option value="CREDIT">Créditos</option>
              <option value="DEBIT">Débitos</option>
            </select>
          </label>
        </div>
        <div className="mt-4 divide-y divide-gray-100">
          {transactions.length === 0 ? <p className="py-6 text-center text-sm text-gray-500">Ainda não há transações na carteira.</p> : transactions.map((item) => (
            <article key={item.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-gray-800">{item.description}</p>
                <p className="text-xs text-gray-500">{formatDate(item.dateTimeTransaction)} · {item.status}</p>
              </div>
              <p className={`font-bold ${item.type === 'CREDIT' ? 'text-emerald-700' : 'text-red-700'}`}>
                {item.type === 'CREDIT' ? '+' : '-'}{formatPoints(item.value)} pontos
              </p>
            </article>
          ))}
        </div>
        {transactionPage && transactionPage.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
            <button type="button" disabled={transactionPage.number === 0 || loading} onClick={() => changePage(transactionPage.number - 1)} className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-50">Anterior</button>
            <span className="text-gray-500">Página {transactionPage.number + 1} de {transactionPage.totalPages}</span>
            <button type="button" disabled={transactionPage.number + 1 >= transactionPage.totalPages || loading} onClick={() => changePage(transactionPage.number + 1)} className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-50">Próxima</button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Meus descartes</h2>
        {disposals.length === 0 ? <p className="py-5 text-sm text-gray-500">Você ainda não registrou descartes.</p> : (
          <div className="mt-3 divide-y divide-gray-100">
            {disposals.map((item) => (
              <article key={item.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{item.collectionPointName}</p>
                  <p className="text-sm text-gray-500">{formatPoints(item.approximateWeightInKg)} kg · {(item.clothTypes || []).join(', ')} · {formatDate(item.createdAt)}</p>
                  {item.justification && <p className="mt-1 text-sm text-red-700">Motivo: {item.justification}</p>}
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-semibold text-gray-700">{item.status === 'PENDING' ? 'Pendente' : item.status === 'CONFIRMED' ? 'Confirmado' : 'Rejeitado'}</p>
                  {item.generatedCashback && <p className="text-emerald-700">+{formatPoints(item.earnedPoints)} pontos</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Wallet
